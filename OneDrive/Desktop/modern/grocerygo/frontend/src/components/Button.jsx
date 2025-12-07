const Button = ({ text , onClick , children}) => {
    return (
        <button className = 'btn' onClick= {onClick}>
            {children || text}
            </button>

    );};
export default Button;