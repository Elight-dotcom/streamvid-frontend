export default function ErrorCard({ message }: { message: string }) {
    return (
        <div className="nv-error">
            <p className="nv-error-message">{message}</p>
        </div>
    );
}