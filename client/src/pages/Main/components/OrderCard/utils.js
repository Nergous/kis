// Общие утилиты форматирования
export const formatPrice = (price) => {
    if (!price && price !== 0) return "—";
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
    }).format(price);
};

export const formatDeliveryDate = (dateString) => {
    if (!dateString) return "Не указана";
    try {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (e) {
        return dateString;
    }
};

export const formatOrderId = (id) => {
    if (!id) return "—";
    return id.toString().slice(-6).padStart(6, "0");
};