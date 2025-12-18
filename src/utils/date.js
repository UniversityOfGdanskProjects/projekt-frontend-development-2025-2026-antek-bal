export const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};