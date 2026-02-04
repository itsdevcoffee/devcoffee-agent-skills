// Test file for maximus with simplifier improvements
function calculateTotal(items) {
    var total = 0;
    var x = 0;

    // Nested conditionals that could be simplified
    if (items) {
        if (items.length > 0) {
            if (Array.isArray(items)) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.price) {
                        total = total + item.price;
                    }
                }
            }
        }
    }

    return total;
}

// Duplicate error handling
function fetchUserData(id) {
    try {
        const data = getUser(id);
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

function fetchProductData(id) {
    try {
        const data = getProduct(id);
        return data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

function fetchOrderData(id) {
    try {
        const data = getOrder(id);
        return data;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
}

// Function with unclear variable names
function processData(a, b, c) {
    var result = a + b * c;
    var x = result / 100;
    var y = x * 50;
    return y;
}

// Missing error handling
function updateUser(userId, data) {
    const user = users[userId];
    user.name = data.name;
    user.email = data.email;
    return user;
}

module.exports = {
    calculateTotal,
    fetchUserData,
    fetchProductData,
    fetchOrderData,
    processData,
    updateUser
};
