// Test file for maximus with simplifier improvements

// Mock implementations for missing dependencies
const getUser = (id) => ({ id, name: 'User', email: 'user@example.com' });
const getProduct = (id) => ({ id, name: 'Product', price: 100 });
const getOrder = (id) => ({ id, items: [], total: 0 });

function calculateTotal(items) {
    if (!items) {
        throw new Error('items parameter is required');
    }
    if (!Array.isArray(items)) {
        throw new Error('items must be an array');
    }

    let total = 0;
    for (const item of items) {
        if (item && typeof item === 'object' && typeof item.price === 'number') {
            total += item.price;
        }
    }

    return total;
}

function fetchDataWithLogging(fetchFunction, resourceType, id) {
    try {
        return fetchFunction(id);
    } catch (error) {
        console.error(`Error fetching ${resourceType}:`, error);
        throw error;
    }
}

function fetchUserData(id) {
    return fetchDataWithLogging(getUser, 'user', id);
}

function fetchProductData(id) {
    return fetchDataWithLogging(getProduct, 'product', id);
}

function fetchOrderData(id) {
    return fetchDataWithLogging(getOrder, 'order', id);
}

function processData(baseAmount, multiplier, factor) {
    const subtotal = baseAmount + multiplier * factor;
    const percentage = subtotal / 100;
    const finalAmount = percentage * 50;
    return finalAmount;
}

function updateUser(userId, data, users) {
    if (!data) {
        throw new Error('User data is required');
    }
    if (!users || !users[userId]) {
        throw new Error(`User with ID ${userId} not found`);
    }

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
