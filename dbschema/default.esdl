module default {
    abstract type Record {
        required created_at: datetime {
            readonly := true;
            default := datetime_of_statement();
        };
    }

    global current_user_id: uuid;

    type User {
        required created_at: datetime {
            readonly := true;
            default := datetime_of_statement();
        };
        required display_name: str {
            constraint exclusive;
            constraint min_len_value(1);
            constraint max_len_value(16);
        };
        required name: str {
            constraint exclusive;
            constraint min_len_value(1);
            constraint max_len_value(50);
        };
        description: str {
            constraint max_len_value(175);
        };
        location: str {
            constraint max_len_value(30);
        };
        required email: str {
            constraint exclusive;
            constraint max_len_value(256);
        };
        required password: str {
            constraint min_len_value(8);
            constraint max_len_value(256);
        };
        required count_highlight: int16 {
            default := 0;
            constraint min_value(0);
        };
        required count_repost: int16 {
            default := 0;
            constraint min_value(0);
        };
        link posts := .<user[is Post];
    }

    type Bookmark {
        required bookmarked_at: datetime {
            readonly := true;
            default := datetime_of_statement();
        };
        required user: User;
        required post: Post;

        trigger bookmark_insert after insert for each do (
            update Post 
            filter .id = __new__.post.id
            set { count_bookmark := .count_bookmark + 1 }
        );

        trigger bookmark_delete after delete for each do (
            update Post 
            filter .id = __old__.post.id
            set { count_bookmark := .count_bookmark - 1 }
        );

        constraint exclusive on ((.user, .post));
    }

    type Favourite extending Record {
        required post: Post;
        required user: User;

        # cant do a second statement for updating user count_favourite...

        trigger favourite_insert after insert for each do (   
            update Post 
            filter .id = __new__.post.id
            set { count_favourite := .count_favourite + 1 }
        );

        trigger favourite_delete after delete for each do (
            update Post 
            filter .id = __old__.post.id
            set { count_favourite := .count_favourite - 1 }
        );

        # cannot ensure receiver is not the sender...
        # trigger send_notification after insert for each do (
        #     insert Notification {
        #         sender := __new__.user,
        #         receiver := __new__.post.user,
        #         post := __new__.post,
        #         event := <Event>"favourite"
        #     }
        # );

        constraint exclusive on ((.user, .post));
    }

    type Highlight extending Record {
        required user: User;
        required post: Post;

        trigger highlight_insert after insert for each do (
            update User
            filter .id = __new__.user.id
            set { count_highlight := .count_highlight + 1 }
        );

        trigger highlight_delete after delete for each do (
            update User
            filter .id = __old__.user.id
            set { count_highlight := .count_highlight - 1 }
        );

        constraint exclusive on ((.user, .post));
    }

    scalar type Event extending enum<"favourite">;

    type Notification extending Record {
        required sender: User;
        required receiver: User;
        required post: Post;
        required event: Event;
        required has_been_seen: bool {
            default := false
        };

        constraint expression on (__subject__.sender != __subject__.receiver);
    }

    type Post {
        required created_at: datetime {
            readonly := true;
            default := datetime_of_statement();
        };
        required user: User;
        repost_of: Post;
        text: str {
            constraint min_len_value(1);
            constraint max_len_value(280);
        };
        required count_bookmark: int16 {
            default := 0;
            constraint min_value(0);
        };
        required count_favourite: int16 {
            default := 0;
            constraint min_value(0);
        };
        required count_repost: int16 {
            default := 0;
            constraint min_value(0);
        };
        property is_bookmarked := (
            select exists (
                select Bookmark filter .user.id = global current_user_id and .post.id = Post.id
            )
        );
        property is_favourited := (
            select exists (
                select Favourite filter .user.id = global current_user_id and .post.id = Post.id
            )
        );
        property is_highlighted := (
            select exists (
                select Highlight filter .user.id = global current_user_id and .post.id = Post.id
            )
        );
        property is_reposted := (
            select exists (
                select Repost filter .user.id = global current_user_id and .post.id = Post.id
            )
        );

        # cant update user count_repost if post is a repost because there is not control flow...
        # also triggers cant perform multiple statements...
        # cant add a constraint expression ensuring repost_of is not a repost... because only one hop is allowed...
    }

    type Repost extending Record {
        required user: User;
        required post: Post;

        # cannot add a multiple statements in a single trigger...
        trigger repost_insert after insert for each do (
            update Post 
            filter .id = __new__.post.id
            set { count_repost := .count_repost + 1 }
        );

        trigger repost_add_post after insert for each do (
            insert Post {
                created_at := __new__.created_at,
                repost_of := __new__.post,
                user := __new__.user
            }
        );

        trigger repost_increase_user_count after insert for each do (
            update User
            filter .id = __new__.user.id
            set { count_repost := .count_repost + 1 }
        );

        trigger repost_delete after delete for each do (
            update Post 
            filter .id = __old__.post.id
            set { count_repost := .count_repost - 1 }
        );

        trigger repost_remove_post after delete for each do (
            delete Post filter .repost_of.id = __old__.post.id
        );

        trigger repost_decrease_user_count after delete for each do (
            update User
            filter .id = __old__.user.id
            set { count_repost := .count_repost - 1 }
        );
    }
}