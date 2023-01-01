export default function FlashError({ message }) {
    return (
        message && (
            <div className="text-red-500 text-center mt-6">{message}</div>
        )
    );
}
