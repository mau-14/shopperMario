export default class NextScene extends Phaser.Scene {
    constructor() {
        super('NextScene'); // Identificador de la escena
    }

    preload() {
        // Carga de recursos necesarios

    this.load.image('castle', 'assets/scenery/castle.png');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fondo
        this.add.image(width / 2, height / 2, 'castle').setOrigin(0.5).setScale(10); // Añade una imagen de fondo si lo necesitas

        // Texto inicial: "HAS GANADO"
        this.add.text(width / 2, height / 4, '¡HAS GANADO!', {
            fontSize: '150px',
            fill: '#FFD700', // Dorado
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6,
            shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 10, fill: true }
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 3, 'Introduce tu nombre', {
            fontSize: '50px',
            fill: '#FFD700', // Dorado
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6,
            shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 10, fill: true }
        }).setOrigin(0.5);

        // Recuperar el tiempo y la puntuación desde el registro
        const gameTime = this.registry.get('gameTime'); // Usar this.registry
        const score = this.registry.get('score'); // Usar this.registry

        // Mostrar el tiempo de la partida
        this.add.text(width / 2, height / 1.8, `Tiempo de la partida: ${gameTime} segundos`, {
            fontSize: '40px',
            fill: '#FFD700', // Tomate
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 5, fill: true }
        }).setOrigin(0.5);

        // Mostrar la puntuación
        this.add.text(width / 2, height / 1.5, `Puntuación: ${score} puntos`, {
            fontSize: '40px',
            fill: '#FFD700', // Verde lima
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 5, fill: true }
        }).setOrigin(0.5);

        // Crear el input HTML para introducir el nombre
        const inputText = this.add.dom(width / 2.05, height / 2.50).createElement('input', {
            type: 'text',
            name: 'name',
            maxlength: '3', // Limitar a 3 caracteres
        }).setOrigin(1);

        // Aplicar estilos al input
        inputText.node.style.fontSize = '48px';
        inputText.node.style.width = '300px';
        inputText.node.style.height = '60px';
        inputText.node.style.padding = '15px';
        inputText.node.style.border = '3px solid #000';
        inputText.node.style.borderRadius = '15px';
        inputText.node.style.backgroundColor = '#fff';
        inputText.node.style.color = '#000';
        inputText.node.style.textAlign = 'center';
        inputText.node.style.textTransform = 'uppercase'; // Forzar mayúsculas

        // Agregar evento para Enter
        inputText.node.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const initials = inputText.node.value;
                console.log('Iniciales:', initials); // Aquí puedes realizar otra acción
            }
        });

        // Validar entrada: solo letras y máximo 3 caracteres
        inputText.addListener('input');
        inputText.on('input', (event) => {
            const value = event.target.value;
            event.target.value = value.replace(/[^A-Za-z]/g, '').slice(0, 3);
        });

        // Botón de "GUARDAR"
        const backButton = this.add.text(width / 2, height / 1.1, 'GUARDAR', {
            fontSize: '30px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4,
            padding: { x: 15, y: 10 },
            backgroundColor: '#28a745', // Color verde brillante
            borderRadius: '10px'
        }).setOrigin(0.5).setInteractive();

        // Evento del botón "GUARDAR"
        backButton.on('pointerdown', async () => {
            // Aquí puedes guardar el nombre y hacer la transición
            const initials = inputText.node.value
            const respuesta = await fetch('./enviarDatos.php',{
                method: 'POST',
                headers: {
                  'Content-type': 'application/json',
                },
              body: JSON.stringify({
                name: initials,
                gameTime: gameTime,
                score: score
              })

            })

             const resultado = await respuesta.text()
          console.log(resultado)
            if(resultado.status === 'success'){
              console.log(resultado.message)
            }
          
            this.scene.start('Mainscene');
        });
    }
}
