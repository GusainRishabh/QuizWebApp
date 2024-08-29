// src/api.js
export const saveTransaction = async (orderId, amount, payerEmail) => {
    try {
        const response = await fetch('http://localhost:3000/api/transaction', { // Update URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, amount, payerEmail }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from server:', errorText);
            return { success: false, message: `Failed to save transaction data: ${errorText}` };
        }

        console.log('Transaction data saved successfully');
        return { success: true, message: 'Transaction data saved successfully' };
    } catch (err) {
        console.error('Error saving transaction data:', err);
        return { success: false, message: `Error saving transaction data: ${err.message}` };
    }
};
