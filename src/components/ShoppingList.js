import React, { useState, useEffect } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isMounted = true; // Track component mount status

    // Fetch items from server
    fetch("http://localhost:4000/items")
      .then((r) => r.json())
      .then((items) => {
        if (isMounted) {
          setItems(items);
        }
      })
      .catch((error) => console.error('Error fetching items:', error));

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  function handleToggleCart(itemId) {
    setItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, isInCart: !item.isInCart }
          : item
      )
    );
  }

  function handleDeleteItem(itemId) {
    setItems((items) => items.filter((item) => item.id !== itemId));
  }

  function handleAddItem(newItem) {
    setItems((items) => [...items, newItem]);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;

    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item
            key={item.id} // Ensure each item has a unique key
            item={item}
            onToggleCart={handleToggleCart}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
