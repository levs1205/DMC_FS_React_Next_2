
function Child(metodo: { multiplicarCuenta: () => void , resta: number }) {
    
    return ( 
        <div>
            <button onClick={() => metodo.multiplicarCuenta()}>Increment</button>
            <p>Resta es {metodo.resta}</p>
        </div>
    );
}

export default Child;
