-- @block
CREATE TABLE MenuItems(
  id INT PRIMARY KEY AUTO_INCREMENT,
  itemName VARCHAR(255) NOT NULL,
  itemPrice DECIMAL(5, 2) NOT NULL,
  itemDescription TEXT,
  itemImage VARCHAR(255)
);

-- @block
SELECT * FROM menuitems;

-- @block
DROP TABLE menuitems

-- @block
--INSERT INTO MenuItems (itemName, itemPrice, itemDescription, itemImage)
