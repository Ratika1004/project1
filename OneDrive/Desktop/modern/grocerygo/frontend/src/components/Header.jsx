import Button from './Button';

const Header = ({groceriesInCart}) => {
    return (
        <header>
            <h2> Grocery App</h2>
            <Button text={`Cart (${groceriesInCart.length})`} onClick={()=>{}}/>

        </header>
    )
};
export default Header;