const MessageBox = ({ type, text }) => {
    const base = "p-3 rounded-md text-sm text-center font-medium";

    const styles = {
        success: base + " bg-green-100 text-green-700",
        error: base + " bg-red-100 text-red-700",
        info: base + " bg-blue-100 text-blue-700",
    };

    return <div className={styles[type] || styles.info}>{text}</div>;
};

export default MessageBox;