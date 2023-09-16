module default {
    abstract type Record {
        required created_at: datetime {
            readonly := true;
            default := datetime_of_statement();
        };
    }

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

        constraint exclusive on ((.user, .post));
    }

    type Post {
        required created_at: datetime {
            readonly := true;
            default := datetime_of_statement();
        };
        required user: User;
        required text: str {
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
    }
}