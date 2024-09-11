document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const firstName = urlParams.get('firstName');

    if (orderId) {
        document.getElementById('orderId').textContent = orderId;
    } else {
        document.querySelector('.confirmation').innerHTML = '<p>Order ID not found. Please contact support.</p>';
    }
});