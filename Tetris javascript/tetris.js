window.onload = function() {
	const largeurGrille = 14;
    const hauteurGrille = 28;
    const carreau = 20;	// Taille en pixels d'une case de la grille
    var canvas;
    var ctx;
	
	// Position de la forme sur la grille
	const XInitial = 5;
	const YInitial = 0;
    var formX = XInitial;
    var formY = YInitial;

	// Numéro de la forme (du tableau "forme") à afficher 
	var numForme = 0;
	// Sélection de la version de la forme à afficher (différentes rotations possibles)
    var rotation = 0;
    
	// Tableau de définition des formes
    var forme = new Array();
    forme[0]= [
        [	// rotation 0
            [0,0,0],
            [1,1,1],
            [0,0,1]
        ],
        [	// rotation 1
            [0,1,0],
            [0,1,0],
            [1,1,0]
        ],
        [	// rotation 2
            [1,0,0],
            [1,1,1],
            [0,0,0]
        ],
        [	// rotation 3
            [0,1,1],
            [0,1,0],
            [0,1,0]
        ]
    ]; 
    
	forme[1] = [
        [	// rotation 0 (cette forme là n'a besoin que de 2 rotations)
            [0,0,0],
            [0,1,1],
            [1,1,0]
        ],
        [	// rotation 1
            [0,1,0],
            [0,1,1],
            [0,0,1]
        ]        
    ];
	
	// !!! Fin de déclaration des variables !!!
	
	// !!! Les fonctions !!!
	
	// Dessine une forme à l'écran 
	// Variable utilisées :
	//		numForme : numéro de la forme à afficher (tableau forme)
	//		rotation : version de la forme à afficher (tableau forme[numForme])
	//		formX : Position horizontale de la forme sur la grille
	//		formY : Position verticale de la forme sur la grille
    function drawForme() {
		for(x=0 ; x<forme[numForme][rotation].length ; x++) {
			for(y=0 ; y<forme[numForme][rotation].length ; y++) {
                if(forme[numForme][rotation][y][x] == 1) {
                    ctx.fillStyle = "#FF0000";
                    ctx.fillRect((formX + x) * carreau, (formY + y) * carreau, carreau, carreau);
                    //ctx.fillStyle = "#00FF00";
                    //ctx.fillRect((formX + x) * carreau + 1, (formY + y) * carreau + 1, carreau - 2, carreau - 2);
                }
            }
        }
    }
    
	// Rafraichi l'affichage :
	//  - efface le canvas
	//  - dessine la forme
    function refreshCanvas() {
		ctx.save();								   
        
		ctx.clearRect(0,0,largeurGrille * carreau, hauteurGrille * carreau);
		
		drawForme();
        
        ctx.restore();
    }

	// Initialisation du canvas
    function init() {
        canvas = document.createElement('canvas');
        canvas.width = largeurGrille * carreau;
        canvas.height = hauteurGrille * carreau;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');

		refreshCanvas();
    }

	// Seul ligne de code... avec la gestion des évènements clavier
    init();

	// Gestion des évènements clavier
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        switch(key) {
            // Remarque : Pour connaitre les keycodes : https://keycode.info/
            case 38:  // flèche haut => rotation horaire de la forme
                rotation++;
                if(rotation >  forme[numForme].length - 1) rotation = 0;
                refreshCanvas();
                break;
            
            case 84:  // toutche t
                // à compléter
				// pour test, ne fait pas parti du jeu final
				// permet de changer la pièce à afficher (changement de la variable numForme
                break;
        }
    }    
}