CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);

INSERT INTO blogs (author, url, title) values ('Jane Doe', 'https://www.techinsights.com/first-blog', 'The Future of AI in Everyday Life');

INSERT INTO blogs (author, url, title, likes) values ('John Smith', 'https://www.writershub.com/creative-writing-tips', 'Top 10 Tips for Creative Writing', 3);