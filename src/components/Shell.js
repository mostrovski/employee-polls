import Header from './Header';
import Main from './Main';

export default function Shell({ heading, children }) {
    return (
        <>
            <Header title={heading} />
            <Main>{children}</Main>
        </>
    );
}
