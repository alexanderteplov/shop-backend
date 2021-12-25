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

INSERT INTO products (title, description, price) VALUES (
	'11" holly Wand, a phoenix feather core',
	'11 inches long, excellent hard holly Wand with a young phoenix feather inside. Well polished and balanced.',
	7
);

INSERT INTO products (title, description, price) VALUES (
	'13" 1/2'' yew Wand, a phoenix feather core',
	'13" 1/2'' inches long, smooth yew Wand with a young phoenix feather inside. Excellent for dark arts.',
	9
);

INSERT INTO stocks ("count", product_id) VALUES (
	1,
	(SELECT id FROM products WHERE title='11" holly Wand, a phoenix feather core')
);

INSERT INTO stocks ("count", product_id) VALUES (
	1,
	(SELECT id FROM products WHERE title='13" 1/2'' yew Wand, a phoenix feather core')
);
