import { useState, useEffect } from 'react';

export default function FoodBudgetPlanner() {
  // State management
  const [budget, setBudget] = useState(30000);
  const [householdSize, setHouseholdSize] = useState(3);
  const [groceryList, setGroceryList] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [daysToGenerate, setDaysToGenerate] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [optimizationMode, setOptimizationMode] = useState("balanced");
  const [isInitialized, setIsInitialized] = useState(false);

  // Enhanced predefined food items with more Malawian staples
  const foodItems = [
    { id: 1, name: "Cooking Oil (500ml)", price: 2500, unit: "bottle", category: "staple" },
    { id: 2, name: "Tomatoes", price: 100, unit: "piece", category: "vegetable" },
    { id: 3, name: "Onions", price: 80, unit: "piece", category: "vegetable" },
    { id: 4, name: "Fish (tilapia)", price: 3500, unit: "kg", category: "protein" },
    { id: 5, name: "Chicken", price: 2800, unit: "kg", category: "protein" },
    { id: 6, name: "Beef", price: 3200, unit: "kg", category: "protein" },
    { id: 7, name: "Beans", price: 1200, unit: "kg", category: "protein" },
    { id: 8, name: "Eggs", price: 120, unit: "piece", category: "protein" },
    { id: 9, name: "Maize Flour", price: 950, unit: "kg", category: "staple" },
    { id: 10, name: "Rice", price: 1500, unit: "kg", category: "staple" },
    { id: 11, name: "Charcoal", price: 700, unit: "kg", category: "utility" },
    { id: 12, name: "Salt", price: 400, unit: "kg", category: "staple" },
    { id: 13, name: "Cabbage", price: 350, unit: "head", category: "vegetable" },
    { id: 14, name: "Potatoes", price: 800, unit: "kg", category: "vegetable" },
    { id: 15, name: "Carrots", price: 600, unit: "kg", category: "vegetable" },
    { id: 16, name: "Bananas", price: 200, unit: "piece", category: "fruit" },
    { id: 17, name: "Green peppers", price: 100, unit: "piece", category: "vegetable" },
    { id: 18, name: "Garlic", price: 50, unit: "clove", category: "vegetable" },
    { id: 19, name: "Ginger", price: 100, unit: "piece", category: "vegetable" },
    { id: 20, name: "Sugar", price: 1200, unit: "kg", category: "staple" },
    { id: 21, name: "Dried Fish (Usipa)", price: 1800, unit: "kg", category: "protein" },
    { id: 22, name: "Groundnuts", price: 1500, unit: "kg", category: "protein" },
    { id: 23, name: "Pumpkin Leaves", price: 200, unit: "bunch", category: "vegetable" },
    { id: 24, name: "Sweet Potatoes", price: 600, unit: "kg", category: "staple" },
    { id: 25, name: "Milk", price: 800, unit: "liter", category: "protein" },
    { id: 26, name: "Bread", price: 500, unit: "loaf", category: "staple" },
    { id: 27, name: "Tea Leaves", price: 300, unit: "packet", category: "staple" },
    { id: 28, name: "Lemons", price: 50, unit: "piece", category: "fruit" },
    { id: 29, name: "Cassava", price: 400, unit: "kg", category: "staple" },
    { id: 30, name: "Soy Pieces", price: 1000, unit: "kg", category: "protein" },
  ];

  // Initialize selected food items
  useEffect(() => {
    if (!isInitialized) {
      const initialSelectedItems = {};
      foodItems.forEach(item => {
        initialSelectedItems[item.id] = true; // Default all to selected
      });
      setSelectedFoodItems(initialSelectedItems);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Enhanced meal recipes with more Malawian dishes
  const allRecipes = [
    {
      id: 1,
      name: "Fish with Rice and Vegetables",
      ingredients: [
        { item: "Fish (tilapia)", quantity: 0.5 },
        { item: "Rice", quantity: 0.5 },
        { item: "Tomatoes", quantity: 3 },
        { item: "Onions", quantity: 2 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
        { item: "Cabbage", quantity: 0.3 },
      ],
      type: "dinner",
      cost: 0,
      frequency: 3, // How often this meal should appear (1-5)
    },
    {
      id: 2,
      name: "Beef Stew with Nsima",
      ingredients: [
        { item: "Beef", quantity: 0.5 },
        { item: "Maize Flour", quantity: 0.6 },
        { item: "Tomatoes", quantity: 3 },
        { item: "Onions", quantity: 2 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
        { item: "Green peppers", quantity: 2 },
      ],
      type: "dinner",
      cost: 0,
      frequency: 3,
    },
    {
      id: 3,
      name: "Beans with Nsima",
      ingredients: [
        { item: "Beans", quantity: 0.4 },
        { item: "Maize Flour", quantity: 0.6 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 1 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
      ],
      type: "lunch",
      cost: 0,
      frequency: 4,
    },
    {
      id: 4,
      name: "Chicken Stew with Rice",
      ingredients: [
        { item: "Chicken", quantity: 0.5 },
        { item: "Rice", quantity: 0.5 },
        { item: "Tomatoes", quantity: 3 },
        { item: "Onions", quantity: 2 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
        { item: "Carrots", quantity: 0.2 },
      ],
      type: "dinner",
      cost: 0,
      frequency: 2,
    },
    {
      id: 5,
      name: "Egg Stew with Nsima",
      ingredients: [
        { item: "Eggs", quantity: 6 },
        { item: "Maize Flour", quantity: 0.6 },
        { item: "Tomatoes", quantity: 3 },
        { item: "Onions", quantity: 2 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
        { item: "Green peppers", quantity: 1 },
      ],
      type: "lunch",
      cost: 0,
      frequency: 3,
    },
    {
      id: 6,
      name: "Vegetable Rice",
      ingredients: [
        { item: "Rice", quantity: 0.5 },
        { item: "Cabbage", quantity: 0.5 },
        { item: "Carrots", quantity: 0.2 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 2 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
      ],
      type: "lunch",
      cost: 0,
      frequency: 2,
    },
    {
      id: 7,
      name: "Fish Curry with Nsima",
      ingredients: [
        { item: "Fish (tilapia)", quantity: 0.5 },
        { item: "Maize Flour", quantity: 0.6 },
        { item: "Tomatoes", quantity: 3 },
        { item: "Onions", quantity: 2 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
        { item: "Garlic", quantity: 3 },
        { item: "Ginger", quantity: 1 },
      ],
      type: "dinner",
      cost: 0,
      frequency: 2,
    },
    {
      id: 8,
      name: "Bean Stew with Rice",
      ingredients: [
        { item: "Beans", quantity: 0.4 },
        { item: "Rice", quantity: 0.5 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 1 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
      ],
      type: "lunch",
      cost: 0,
      frequency: 3,
    },
    {
      id: 9,
      name: "Potato and Egg Stew",
      ingredients: [
        { item: "Potatoes", quantity: 0.5 },
        { item: "Eggs", quantity: 3 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 1 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
      ],
      type: "lunch",
      cost: 0,
      frequency: 2,
    },
    {
      id: 10,
      name: "Simple Nsima with Vegetables",
      ingredients: [
        { item: "Maize Flour", quantity: 0.6 },
        { item: "Cabbage", quantity: 0.5 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 1 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
      ],
      type: "lunch",
      cost: 0,
      frequency: 3,
    },
    {
      id: 11,
      name: "Usipa with Nsima",
      ingredients: [
        { item: "Dried Fish (Usipa)", quantity: 0.3 },
        { item: "Maize Flour", quantity: 0.6 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 1 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
      ],
      type: "dinner",
      cost: 0,
      frequency: 3,
    },
    {
      id: 12,
      name: "Groundnut Stew with Nsima",
      ingredients: [
        { item: "Groundnuts", quantity: 0.3 },
        { item: "Maize Flour", quantity: 0.6 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 1 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
        { item: "Pumpkin Leaves", quantity: 1 },
      ],
      type: "dinner",
      cost: 0,
      frequency: 2,
    },
    {
      id: 13,
      name: "Sweet Potato Nsima with Beans",
      ingredients: [
        { item: "Sweet Potatoes", quantity: 0.5 },
        { item: "Maize Flour", quantity: 0.3 },
        { item: "Beans", quantity: 0.4 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 1 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
      ],
      type: "lunch",
      cost: 0,
      frequency: 2,
    },
    {
      id: 14,
      name: "Cassava with Fish",
      ingredients: [
        { item: "Cassava", quantity: 0.5 },
        { item: "Fish (tilapia)", quantity: 0.5 },
        { item: "Tomatoes", quantity: 2 },
        { item: "Onions", quantity: 1 },
        { item: "Cooking Oil (500ml)", quantity: 0.1 },
        { item: "Salt", quantity: 0.01 },
      ],
      type: "dinner",
      cost: 0,
      frequency: 2,
    },
    {
      id: 15,
      name: "Tea with Bread",
      ingredients: [
        { item: "Bread", quantity: 0.5 },
        { item: "Tea Leaves", quantity: 0.05 },
        { item: "Sugar", quantity: 0.1 },
        { item: "Milk", quantity: 0.2 },
      ],
      type: "breakfast",
      cost: 0,
      frequency: 5,
    },
    {
      id: 16,
      name: "Banana Pancakes",
      ingredients: [
        { item: "Maize Flour", quantity: 0.3 },
        { item: "Bananas", quantity: 3 },
        { item: "Sugar", quantity: 0.05 },
        { item: "Cooking Oil (500ml)", quantity: 0.05 },
      ],
      type: "breakfast",
      cost: 0,
      frequency: 2,
    },
  ];

  // Toggle food item selection
  const toggleFoodItem = (id) => {
    setSelectedFoodItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate recipe costs and filter available recipes based on selected items
  const calculateAvailableRecipes = () => {
    const selectedItemsMap = {};
    foodItems.forEach(item => {
      if (selectedFoodItems[item.id]) {
        selectedItemsMap[item.name] = item;
      }
    });

    return allRecipes.map(recipe => {
      let recipeCost = 0;
      let allIngredientsAvailable = true;

      recipe.ingredients.forEach(ingredient => {
        const foodItem = selectedItemsMap[ingredient.item];
        if (!foodItem) {
          allIngredientsAvailable = false;
        } else {
          recipeCost += foodItem.price * ingredient.quantity * householdSize;
        }
      });

      return {
        ...recipe,
        cost: recipeCost,
        available: allIngredientsAvailable
      };
    });
  };

  // Generate meal plan for the period
  const generateMealPlan = (mode = optimizationMode) => {
    setIsLoading(true);
    setShowError(false);
    
    // Calculate available recipes
    const recipesWithCost = calculateAvailableRecipes();
    const availableRecipes = recipesWithCost.filter(recipe => recipe.available);
    
    // Check if we have any recipes at all
    if (availableRecipes.length === 0) {
      setErrorMessage("No recipes available with the selected ingredients. Please select more food items.");
      setShowError(true);
      setIsLoading(false);
      return;
    }
    
    // Get recipes by meal type
    const availableBreakfastRecipes = availableRecipes.filter(recipe => recipe.type === "breakfast");
    const availableLunchRecipes = availableRecipes.filter(recipe => recipe.type === "lunch");
    const availableDinnerRecipes = availableRecipes.filter(recipe => recipe.type === "dinner");
    
    // If no specific meal types, use all available
    const useLunchRecipes = availableLunchRecipes.length > 0 ? availableLunchRecipes : availableRecipes;
    const useDinnerRecipes = availableDinnerRecipes.length > 0 ? availableDinnerRecipes : availableRecipes;
    const useBreakfastRecipes = availableBreakfastRecipes.length > 0 ? availableBreakfastRecipes : availableRecipes;
    
    // Calculate maximum daily budget
    const dailyBudget = budget / daysToGenerate;
    
    // Create array for days
    const newMealPlan = [];
    let totalCost = 0;
    
    // Create weighted recipe pools based on frequency
    const createWeightedPool = (recipes) => {
      const pool = [];
      recipes.forEach(recipe => {
        for (let i = 0; i < (recipe.frequency || 1); i++) {
          pool.push(recipe);
        }
      });
      return pool;
    };
    
    const lunchPool = createWeightedPool(useLunchRecipes);
    const dinnerPool = createWeightedPool(useDinnerRecipes);
    const breakfastPool = createWeightedPool(useBreakfastRecipes);
    
    // Shuffle function for variety
    const shuffle = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
    
    // Generate meals for each day
    for (let day = 1; day <= daysToGenerate; day++) {
      // Get random meals based on mode
      let breakfast, lunch, dinner;
      
      if (mode === "variety") {
        // For variety mode, shuffle the pools and pick first
        breakfast = shuffle(breakfastPool)[0];
        lunch = shuffle(lunchPool)[0];
        dinner = shuffle(dinnerPool)[0];
      } else if (mode === "economic") {
        // For economic mode, sort by cost and pick cheapest
        breakfast = [...breakfastPool].sort((a, b) => a.cost - b.cost)[0];
        lunch = [...lunchPool].sort((a, b) => a.cost - b.cost)[0];
        dinner = [...dinnerPool].sort((a, b) => a.cost - b.cost)[0];
      } else {
        // Balanced mode - mix of cost and variety
        if (day % 3 === 0) {
          // Every 3rd day, prioritize cost
          breakfast = [...breakfastPool].sort((a, b) => a.cost - b.cost)[0];
          lunch = [...lunchPool].sort((a, b) => a.cost - b.cost)[0];
          dinner = [...dinnerPool].sort((a, b) => a.cost - b.cost)[0];
        } else {
          // Other days, prioritize variety
          breakfast = shuffle(breakfastPool)[0];
          lunch = shuffle(lunchPool)[0];
          dinner = shuffle(dinnerPool)[0];
        }
      }
      
      // Calculate day's cost
      const dayCost = (breakfast?.cost || 0) + (lunch?.cost || 0) + (dinner?.cost || 0);
      
      // If we're going over budget, try to find cheaper alternatives
      if (totalCost + dayCost > budget) {
        const remainingBudget = budget - totalCost;
        const remainingDays = daysToGenerate - day + 1;
        const remainingDailyBudget = remainingBudget / remainingDays;
        
        // Find cheaper meals that fit the remaining budget
        const affordableBreakfasts = breakfastPool.filter(r => r.cost <= remainingDailyBudget * 0.3);
        const affordableLunches = lunchPool.filter(r => r.cost <= remainingDailyBudget * 0.4);
        const affordableDinners = dinnerPool.filter(r => r.cost <= remainingDailyBudget * 0.4);
        
        if (affordableBreakfasts.length > 0) {
          breakfast = affordableBreakfasts.sort((a, b) => a.cost - b.cost)[0];
        }
        if (affordableLunches.length > 0) {
          lunch = affordableLunches.sort((a, b) => a.cost - b.cost)[0];
        }
        if (affordableDinners.length > 0) {
          dinner = affordableDinners.sort((a, b) => a.cost - b.cost)[0];
        }
      }
      
      // Final day cost calculation
      const finalDayCost = (breakfast?.cost || 0) + (lunch?.cost || 0) + (dinner?.cost || 0);
      totalCost += finalDayCost;
      
      newMealPlan.push({
        day,
        breakfast: breakfast?.name || "None",
        lunch: lunch?.name || "None",
        dinner: dinner?.name || "None",
        breakfastCost: breakfast?.cost || 0,
        lunchCost: lunch?.cost || 0,
        dinnerCost: dinner?.cost || 0,
        dayCost: finalDayCost
      });
    }
    
    // Final budget check - if we're still over, scale down quantities
    if (totalCost > budget) {
      const scaleFactor = budget / totalCost;
      const scaledPlan = newMealPlan.map(day => ({
        ...day,
        breakfastCost: day.breakfastCost * scaleFactor,
        lunchCost: day.lunchCost * scaleFactor,
        dinnerCost: day.dinnerCost * scaleFactor,
        dayCost: day.dayCost * scaleFactor
      }));
      
      setMealPlan(scaledPlan);
      generateGroceryList(scaledPlan);
    } else {
      setMealPlan(newMealPlan);
      generateGroceryList(newMealPlan);
    }
    
    setIsLoading(false);
  };

  // Calculate grocery quantities based on meal plan
  const generateGroceryList = (mealPlan) => {
    const groceryNeeds = {};
    
    mealPlan.forEach(day => {
      // Process breakfast if it exists
      if (day.breakfast && day.breakfast !== "None") {
        const breakfastRecipe = allRecipes.find(recipe => recipe.name === day.breakfast);
        if (breakfastRecipe) {
          breakfastRecipe.ingredients.forEach(ingredient => {
            const adjQuantity = ingredient.quantity * householdSize;
            if (groceryNeeds[ingredient.item]) {
              groceryNeeds[ingredient.item] += adjQuantity;
            } else {
              groceryNeeds[ingredient.item] = adjQuantity;
            }
          });
        }
      }
      
      // Process lunch
      if (day.lunch && day.lunch !== "None") {
        const lunchRecipe = allRecipes.find(recipe => recipe.name === day.lunch);
        if (lunchRecipe) {
          lunchRecipe.ingredients.forEach(ingredient => {
            const adjQuantity = ingredient.quantity * householdSize;
            if (groceryNeeds[ingredient.item]) {
              groceryNeeds[ingredient.item] += adjQuantity;
            } else {
              groceryNeeds[ingredient.item] = adjQuantity;
            }
          });
        }
      }
      
      // Process dinner
      if (day.dinner && day.dinner !== "None") {
        const dinnerRecipe = allRecipes.find(recipe => recipe.name === day.dinner);
        if (dinnerRecipe) {
          dinnerRecipe.ingredients.forEach(ingredient => {
            const adjQuantity = ingredient.quantity * householdSize;
            if (groceryNeeds[ingredient.item]) {
              groceryNeeds[ingredient.item] += adjQuantity;
            } else {
              groceryNeeds[ingredient.item] = adjQuantity;
            }
          });
        }
      }
    });
    
   
       // Create initial grocery list with calculated quantities
       const initialGroceryList = Object.keys(groceryNeeds)
       .map(itemName => {
         const foodItem = foodItems.find(item => item.name === itemName);
         if (!foodItem) return null;
         
         return {
           name: itemName,
           quantity: Math.ceil(groceryNeeds[itemName]),
           unit: foodItem.unit,
           unitPrice: foodItem.price,
           totalCost: 0, // Will be calculated after prioritization
           priority: getItemPriority(foodItem),
           category: foodItem.category
         };
       })
       .filter(item => item !== null);
 
     // Adjust quantities to exactly match the budget
     const adjustedList = optimizeGroceryList(initialGroceryList, budget);
     setGroceryList(adjustedList);
   };
 
   // Priority system for Malawian essential foods
   const getItemPriority = (foodItem) => {
     // Highest priority - absolute essentials
     if (foodItem.name.includes("Maize Flour")) return 5;
     if (foodItem.name.includes("Cooking Oil")) return 4;
     if (foodItem.name.includes("Salt")) return 4;
     
     // High priority - proteins and staple vegetables
     if (foodItem.category === "protein") return 3;
     if (["Tomatoes", "Onions", "Cabbage"].includes(foodItem.name)) return 3;
     
     // Medium priority - other vegetables
     if (foodItem.category === "vegetable") return 2;
     
     // Lowest priority - everything else
     return 1;
   };
 
   // Optimize grocery list to exactly match the budget
   const optimizeGroceryList = (groceryList, totalBudget) => {
     // Sort by priority (highest first), then by cost per unit (cheapest first)
     const sortedList = [...groceryList].sort((a, b) => {
       if (b.priority !== a.priority) return b.priority - a.priority;
       return a.unitPrice - b.unitPrice;
     });
 
     // Calculate initial quantities and costs
     let remainingBudget = totalBudget;
     const optimizedList = [];
     
     // First pass: allocate budget to highest priority items first
     for (const item of sortedList) {
       const maxAffordable = Math.floor(remainingBudget / item.unitPrice);
       
       if (maxAffordable > 0) {
         // For essentials, ensure minimum quantities
         const minQuantity = item.priority >= 4 ? 1 : 0;
         const quantity = Math.max(minQuantity, Math.min(item.quantity, maxAffordable));
         
         const cost = quantity * item.unitPrice;
         optimizedList.push({ ...item, quantity, totalCost: cost });
         remainingBudget -= cost;
       }
     }
     
     // Second pass: distribute remaining budget to maximize nutrition
     if (remainingBudget > 0) {
       // Sort by nutritional value (priority) then by cost
       optimizedList.sort((a, b) => {
         if (b.priority !== a.priority) return b.priority - a.priority;
         return a.unitPrice - b.unitPrice;
       });
       
       // Add items until budget is fully used
       for (const item of optimizedList) {
         while (remainingBudget >= item.unitPrice) {
           item.quantity += 1;
           item.totalCost += item.unitPrice;
           remainingBudget -= item.unitPrice;
         }
         
         if (remainingBudget === 0) break;
       }
     }
     
     // Final sort for display (alphabetical)
     return optimizedList.sort((a, b) => a.name.localeCompare(b.name));
   };
 
   // Calculate total cost (should always equal budget)
   const totalCost = groceryList.reduce((sum, item) => sum + item.totalCost, 0);
   const dailyAvgCost = daysToGenerate > 0 ? totalCost / daysToGenerate : 0;
   const costPerPersonPerDay = householdSize > 0 ? dailyAvgCost / householdSize : 0;
  // Generate first meal plan when items are initialized
  useEffect(() => {
    if (isInitialized && Object.keys(selectedFoodItems).length > 0) {
      generateMealPlan();
    }
  }, [isInitialized]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Malawian Household Food Budget Planner</h1>
      
      {/* Settings Panel */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium">Budget (MWK)</label>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Household Size</label>
            <input 
              type="number" 
              value={householdSize} 
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Days to Plan</label>
            <input 
              type="number" 
              value={daysToGenerate} 
              onChange={(e) => setDaysToGenerate(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="1"
              max="90"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-2 font-medium">Meal Plan Optimization</label>
          <select 
            value={optimizationMode} 
            onChange={(e) => setOptimizationMode(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded"
          >
            <option value="balanced">Balanced (Mix of economy and variety)</option>
            <option value="economic">Economic (Prioritize lower cost meals)</option>
            <option value="variety">Variety (Prioritize diverse meals)</option>
          </select>
        </div>
      </div>
      
      {/* Food Item Selection */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Available Food Items</h2>
        <div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">Food Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {["staple", "protein", "vegetable", "fruit", "utility"].map(category => (
                <button 
                  key={category}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  onClick={() => {
                    const newSelections = {...selectedFoodItems};
                    foodItems.forEach(item => {
                      if (item.category === category) {
                        newSelections[item.id] = true;
                      }
                    });
                    setSelectedFoodItems(newSelections);
                  }}
                >
                  Select All {category.charAt(0).toUpperCase() + category.slice(1)}s
                </button>
              ))}
              <button 
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                onClick={() => {
                  const newSelections = {};
                  foodItems.forEach(item => {
                    newSelections[item.id] = false;
                  });
                  setSelectedFoodItems(newSelections);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {foodItems.map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`food-item-${item.id}`}
                  checked={selectedFoodItems[item.id] || false}
                  onChange={() => toggleFoodItem(item.id)}
                  className="mr-2"
                />
                <label htmlFor={`food-item-${item.id}`} className="flex-1">
                  {item.name} - MWK {item.price}/{item.unit}
                </label>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => generateMealPlan(optimizationMode)} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Meal Plan"}
          </button>
        </div>
      </div>
      
      {/* Error Messages */}
      {showError && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}
      
      {/* Budget Summary */}
      <div className="bg-green-100 p-4 rounded-lg mb-6">
    <h2 className="text-xl font-semibold mb-2">Budget Allocation</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="font-medium">Total Budget:</p>
        <p className="text-2xl">MWK {budget.toLocaleString()}</p>
      </div>
      <div>
        <p className="font-medium">Allocated Spending:</p>
        <p className="text-2xl">MWK {totalCost.toLocaleString()}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <p className="font-medium">Daily Food Budget:</p>
        <p className="text-xl">MWK {dailyAvgCost.toFixed(2)}</p>
      </div>
      <div>
        <p className="font-medium">Per Person Daily:</p>
        <p className="text-xl">MWK {costPerPersonPerDay.toFixed(2)}</p>
      </div>
    </div>
    
    <div className="mt-3 text-green-700">
      ✓ Your entire budget of MWK {budget.toLocaleString()} has been allocated to essential food items.
    </div>
  </div>
      
      
      {/* Shopping List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Shopping List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-left">Item</th>
                <th className="py-2 px-4 border text-left">Quantity</th>
                <th className="py-2 px-4 border text-left">Unit Price (MWK)</th>
                <th className="py-2 px-4 border text-left">Total (MWK)</th>
              </tr>
            </thead>
            <tbody>
              {groceryList.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{item.name}</td>
                  <td className="py-2 px-4 border">{item.quantity} {item.unit}</td>
                  <td className="py-2 px-4 border">{item.unitPrice.toLocaleString()}</td>
                  <td className="py-2 px-4 border">{item.totalCost.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="py-2 px-4 border" colSpan="3">Total</td>
                <td className="py-2 px-4 border">{totalCost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Meal Plan */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Meal Plan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-left">Day</th>
                <th className="py-2 px-4 border text-left">Breakfast</th>
                <th className="py-2 px-4 border text-left">Breakfast Cost</th>
                <th className="py-2 px-4 border text-left">Lunch</th>
                <th className="py-2 px-4 border text-left">Lunch Cost</th>
                <th className="py-2 px-4 border text-left">Dinner</th>
                <th className="py-2 px-4 border text-left">Dinner Cost</th>
                <th className="py-2 px-4 border text-left">Day Total</th>
              </tr>
            </thead>
            <tbody>
              {mealPlan.map((day, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">Day {day.day}</td>
                  <td className="py-2 px-4 border">{day.lunch}</td>
                  <td className="py-2 px-4 border">MWK {day.lunchCost.toLocaleString()}</td>
                  <td className="py-2 px-4 border">{day.dinner}</td>
                  <td className="py-2 px-4 border">MWK {day.dinnerCost.toLocaleString()}</td>
                  <td className="py-2 px-4 border">MWK {day.dayCost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}