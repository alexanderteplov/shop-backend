CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title text NOT NULL,
	description text,
	price integer
);

CREATE TABLE stocks (
	product_id uuid REFERENCES products (id),
	"count" integer
);

CREATE TEMP TABLE IF NOT EXISTS uuids AS
WITH ids (num, id) AS (
	VALUES
	(1, uuid_generate_v4()),
	(2, uuid_generate_v4())
)
SELECT * FROM ids;

INSERT INTO products (id, title, description, price) VALUES (
	(SELECT id FROM uuids WHERE num=1),
	'11" holly Wand, a phoenix feather core',
	'11 inches long, excellent hard holly Wand with a young phoenix feather inside. Well polished and balanced.',
	7
);

INSERT INTO products (id, title, description, price) VALUES (
	(SELECT id FROM uuids WHERE num=2),
	'13" 1/2'' yew Wand, a phoenix feather core',
	'13" 1/2'' inches long, smooth yew Wand with a young phoenix feather inside. Excellent for dark arts.',
	9
);

INSERT INTO stocks ("count", product_id) VALUES (
	1,
	(SELECT id FROM uuids WHERE num=1)
);

INSERT INTO stocks ("count", product_id) VALUES (
	1,
	(SELECT id FROM uuids WHERE num=2)
);
