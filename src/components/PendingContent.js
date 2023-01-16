import Content from './Content';

export default function PendingContent({ heading = '...' }) {
    return (
        <Content heading={heading}>
            <div className="h-96 rounded-lg bg-white flex justify-center items-center animate-pulse">
                <div className="text-7xl">...</div>
            </div>
        </Content>
    );
}
