module default {
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
    }
}