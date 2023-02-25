/** 
 * To DOM.
 *
 * @return {DOM}
 */
String.prototype.toDOMElements = function() {
    let i,
        d = document,
        a = d.createElement('div'),
        b = d.createDocumentFragment();
    a.innerHTML = this;
    while(i = a.firstChild) {
        b.appendChild(i);
    };
    return b;
};
/**
 * Add Alpha.
 *
 * @param {string} hexCode 
 * @param {integer} opacity 
 */
const addAlpha = (hexCode, opacity) => {
    let roundedOpacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return hexCode + roundedOpacity.toString(16).toUpperCase();
}
/**
 * Style to String.
 *
 * @param  {string} style 
 *
 * @return {string}       
 */
const styleToString = (style) => {
    let selector = Object.keys(style)[0],
        rules = Object.values(style)[0],
        cssStyles = selector + ' {' + "\n" +
            Object.keys(rules).reduce((acc, key) => (
                acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ': ' + (rules[key] !== '' ? rules[key] : '""') + ';' + "\n"
            ), '') + 
        '}' + "\n";
    return cssStyles;
}
/**
 * Hero Animation CSS Styles.
 */
class heroAnimationCssStyles {
    constructor(cols, rows, bgColor, shapeHeight, shapeWidth) {
        this.cols = cols;
        this.rows = rows;
        this.bgColor = bgColor;
        this.shapeHeight = shapeHeight;
        this.shapeWidth = shapeWidth;
        this.cells = this.cols * this.rows;
        this.cssStyles = '';
    }
    getNthShape(num, translateX, translateY) {
        return {
            ['.hero-animation_shape:nth-child(' + num + ')']: {
                'transform': 'translate(' + translateX + ', ' + translateY + ')'
            }
        };
    }
    init() {
        this.cssStyles += styleToString({
            'body': {
                'position': 'relative',
                'margin': 0
            }
        });
        this.cssStyles += styleToString({
            '.hero-animation_wrapper': {
                'position': 'fixed',
                'z-index' : -2,
                'top': 0,
                'background-color': this.bgColor,
                'height': '100vh',
                'width': '100vw',
                'overflow': 'hidden'
            }
        });
        this.cssStyles += styleToString({
            '.hero-animation_container': {
                'display': 'grid',
                'grid-template-columns': 'repeat(' + this.cols + ', ' + this.shapeWidth + 'px)',
                'grid-template-rows': 'repeat(' + this.rows + ', ' + this.shapeHeight + 'px)',
                'transform': 'translate(-3%, -4%)', // Starting point bleeds off edge
                'position': 'absolute',
                'z-index': -2
            }
        });
        this.cssStyles += styleToString({
            '.hero-animation_overlay': {
                'width': '100vw',
                'height': '100vh',
                'position': 'absolute', 
                'z-index': -1,
                'background': 'radial-gradient(circle, transparent 0%, ' + addAlpha(this.bgColor, 15) + ' 100%)'
            }
        });
        this.cssStyles += styleToString({
            '.hero-animation_shape': {
                'width': this.shapeWidth + 'px',
                'height': this.shapeHeight + 'px',
                '-webkit-clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)',
                'clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)'
            }
        });
        for(let i=1; i< this.cells; i++) {
            if(i > this.cols) {
                this.cssStyles += styleToString(this.getNthShape(i, '-50%', '-25%'));
            }
            if(i > this.cols * 2) {
                this.cssStyles += styleToString(this.getNthShape(i, '0%', '-50%'));
            }
            if(i > this.cols * 3) {
                this.cssStyles += styleToString(this.getNthShape(i, '-50%', '-75%'));
            }
            if(i > this.cols * 4) {
                this.cssStyles += styleToString(this.getNthShape(i, '0%', '-100%'));
            }
            if(i > this.cols * 5) {
                this.cssStyles += styleToString(this.getNthShape(i, '-50%', '-125%'));
            }
        }
        this.render();
    }
    render() {
        const style = document.createElement('style');
        style.innerHTML = this.cssStyles;
        document.head.appendChild(style);
    }
};
/**
 * Hero Animation HTML.
 */
class heroAnimationHtml {
    constructor() {
        this.htmlString = '';
    }
    generateSvgs() {
        for(let i=0; i<60; i++) {
            this.htmlString += '<svg class="hero-animation_shape" viewBox="0 0 100 115" preserveAspectRatio="xMidYMin slice">' + "\n";
            this.generatePolygon(0, 'hsl(320,100%,70%)'); // Pink (#ff66cc)
            this.generatePolygon(1, 'hsl(240,100%,70%)'); // Blue (#6666ff)
            this.generatePolygon(2, 'hsl(160,100%,70%)'); // Mint (#66ffcc)
            this.generatePolygon(3, 'hsl(80,100%,70%)'); // Lime (#ccff66)
            this.htmlString += '</svg>' + "\n";
        }
    }
    generatePolygon(num, color) {
        this.htmlString += '<polygon ' +
            'points="" ' +
            'fill="none" ' +
            'stroke="' + color + '" ' +
            'stroke-width="5">';
        this.generateAnimate(num);
        this.htmlString += '</polygon>' + "\n";
    }
    generateAnimate(num) {
        this.htmlString += '<animate ' +
            'attributeName="points" ' +
            'repeatCount="indefinite" ' +
            'dur="4s" ' + 
            'begin="'+ num + 's" ' + 
            'from="50 57.5, 50 57.5, 50 57.5" ' +
            'to="50 -75, 175 126, -75 126"></animate>' + "\n";
    }
    init() {
        this.htmlString = '<div class="hero-animation_wrapper">' + "\n" + 
            '<div class="hero-animation_overlay"></div>' + "\n" +
            '<div class="hero-animation_container">' + "\n";
        this.generateSvgs();
        this.htmlString += '</div>' + "\n" +
        '</div>' + "\n";
        this.render();
    }
    render() {
        document.body.appendChild(this.htmlString.toDOMElements());
    }
}
let heroCss = new heroAnimationCssStyles(10, 6, '#6223D2', 230, 200);
heroCss.init();
let heroHtml = new heroAnimationHtml();
heroHtml.init();
/**
 * Escher CSS Styles.
 */
class escherCssStyles {
    constructor(size, bgColor, tan, black, brick, grey, greyStripes) {
        this.size = size;
        this.bgColor = bgColor;
        this.tan = tan;
        this.black = black;
        this.brick = brick;
        this.grey = grey;
        this.greyStripes = greyStripes;
        this.columnWidth = this.size * 56 / 20;
        this.escher_rowHeight = this.size * 48 / 20;   
        this.cssStyles = '';
        this.numberOfColumns = 15;
        this.numberOfRows = 13; 
    }
    getZoomOutAnimation() {
        return {
            '@keyframes zoom-out': {
                ' ': 'from {transform: scale(2);}',
                ' ': 'to {transform: scale(1);}'
            }
        }
    }
    getBaseWalls = (floorColor, withMiniRoof) => {
        let cssStyles = {
            '.escher_side:nth-child(1)': {
                'transform': 'rotateX(90deg) translateZ(-' + this.size + 'px)',
                'background': floorColor,
                'width': (this.size * 2) + 'px',
                'height': (this.size * 2) + 'px'
            },
            '.escher_side:nth-child(2)': {
                'transform': 'translateZ(-' + this.size + 'px)',
                'background': this.tan,
                'width': (this.size * 2) + 'px',
                'height': (this.size * 2) + 'px'
            },
            '.escher_side:nth-child(3)': {
                'transform': 'rotateY(90deg) rotateZ(90deg) translateZ(-' + this.size + 'px)',
                'background': this.black,
                'width': (this.size * 2) + 'px',
                'height': (this.size * 2) + 'px'
            }
        };
        if(withMiniRoof) {
            cssStyles = Object.assign(cssStyles, this.getMiniRoof());
        }
        return cssStyles;
    }
    getMiniRoof() {
        let cssStyles = {
            '.escher_side:nth-child(1)::after': {
                'content': '',
                'position': 'absolute',
                'right': 0,
                'bottom': 0,
                'width': this.size + 'px',
                'height': this.size + 'px',
                'background': 'linear-gradient(45deg, ' + this.black + ' 0%, ' + this.black + ' 50%, ' + this.tan + ' 50%, ' + this.tan + ' 100%)'
            }
        };
        return cssStyles;
    }
    getWindow = (left, top, width, height) => {
        let cssStyles = {
            'content': '',
            'position': 'absolute',
            'left': (this.size / 4) + 'px',
            'top': (this.size / 2) + 'px',
            'width': (this.size / 2.5) + 'px',
            'height': (this.size / 1.25) + 'px',
            'background': 'linear-gradient(-45deg, ' + this.grey + ' 0%, ' + this.grey + ' 33%, ' + this.black + ' 33%, ' + this.black + ' 100%)'
        };
        return cssStyles;
    }
    getVariantA = (floorColor, withMiniRoof) => {
        let cssStyles = this.getBaseWalls(floorColor, withMiniRoof);
        return cssStyles;
    }
    getVariantB = (withMiniRoof) => {
        let cssStyles = Object.assign(this.getBaseWalls(this.greyStripes, withMiniRoof), {
            '.escher_side:nth-child(4)': {
                'transform': 'rotateX(90deg) translateX(-' + (this.size / 2) + 'px) translateY(-' + (this.size / 2) + 'px)',
                'background': this.brick,
                'width': this.size + 'px',
                'height': this.size + 'px'
            },
            '.escher_side:nth-child(5)': {
                'transform': 'translateX(-' + (this.size / 2) + 'px) translateY(' + (this.size / 2) + 'px)',
                'background': this.tan,
                'width': this.size + 'px',
                'height': this.size + 'px'
            },
            '.escher_side:nth-child(6)': {
                'transform': 'rotateY(90deg) translateX(' + (this.size / 2) + 'px) translateY(' + (this.size / 2) + 'px)',
                'background': this.black,
                'width': this.size + 'px',
                'height': this.size + 'px'
            }
        });
        return cssStyles;
    }
    getVariantC() {
        let cssStyles = Object.assign(this.getBaseWalls(this.greyStripes, false), {
            '.escher_side:nth-child(3)': {
                'background': this.greyStripes
            },
            '.escher_side:nth-child(2)::after': this.getWindow(this.size / 4, this.size / 2, this.size / 2.5, this.size / 1.25),
            '.escher_side:nth-child(4)': {
                'transform': 'rotateX(90deg) translateX(' + (this.size / 2) + 'px)',
                'background': this.brick,
                'width': this.size + 'px',
                'height': (this.size * 2) + 'px'
            },
            /* Long Cube (Left) */
            '.escher_side:nth-child(5)': {
                'transform': 'translateX(' + (this.size / 2) + 'px) translateY(' + (this.size / 2) + 'px) translateZ(' + this.size + 'px)',
                'background': this.tan,
                'width': this.size + 'px',
                'height': this.size + 'px'
            },
            /* Small Window */
            '.escher_side:nth-child(5)::after': this.getWindow(this.size / 3, this.size / 4, this.size / 3, this.size / 1.5),
            /* Small Window (Right) */
            '.escher_side:nth-child(6)': {
                'transform': 'rotateY(90deg) translateY(' + (this.size / 2) + 'px) translateZ(' + this.size + 'px)',
                'background': this.black,
                'width': (this.size * 2) + 'px',
                'height': this.size + 'px'
            }
        });
        return cssStyles;
    }
    getVariantD = (floorColor, smallCubeTop) => {
        let cssStyles = Object.assign(this.getBaseWalls(floorColor, false), {
            /* Small Cube on the Side (Top) */
            '.escher_side:nth-child(4)': {
                'transform': 'rotateX(90deg) translateX(-' + (this.size / 2) + 'px) translateY(' + (this.size / 2) + 'px)',
                'background': smallCubeTop,
                'width': this.size + 'px',
                'height': this.size + 'px'
            },
            /* Small Cube on the Side (Left) */
            '.escher_side:nth-child(5)': {
                'transform': 'translateX(-' + (this.size / 2) + 'px) translateY(' + (this.size / 2) + 'px) translateZ(' + this.size + 'px)',
                'background': this.tan,
                'width': this.size + 'px',
                'height': this.size + 'px'
            },
            /* Small Cube on the Side (Top) */
            '.escher_side:nth-child(6)': {
                'transform': 'rotateY(90deg) translateX(-' + (this.size / 2) + 'px) translateY(' + (this.size / 2) + 'px)',
                'background': this.black,
                'width': this.size + 'px',
                'height': this.size + 'px'
            }
        });
        return cssStyles;
    }
    getVariantE1 = (floorColor, withWindow) => {
        /* Bottom */
        let cssStyles = {
            '.escher_side:nth-child(1)': {
                'transform': 'rotateX(90deg) translateX(' + this.size + 'px) translateY(-' + this.size + 'px) translateZ(-' + this.size + 'px)',
                'background': floorColor,
                'width': (this.size * 4) + 'px',
                'height': (this.size * 4) + 'px'
            },
            /* Right */
            '.escher_side:nth-child(2)': {
                'transform': 'translateX(-' + (this.size / 2) + 'px) translateZ(-' + this.size + 'px)',
                'background': this.tan,
                'width': this.size + 'px',
                'height': (this.size * 2) + 'px'
            },
            /* Right Overflow */
            '.escher_side:nth-child(3)': {
                'transform': 'rotateY(90deg) translateX(' + (this.size * 1.5) + 'px)',
                'background': this.black,
                'width': this.size + 'px',
                'height': (this.size * 2) + 'px'
            },
            /* Right Overflow 2 */
            '.escher_side:nth-child(4)': {
                'transform': 'translateX(' + this.size + 'px) translateZ(-' + (this.size * 2) + 'px)',
                'background': this.tan,
                'width': (this.size * 2) + 'px',
                'height': (this.size * 2) + 'px'
            },
            /* Left */
            '.escher_side:nth-child(5)': {
                'transform': 'rotateY(90deg) translateZ(-' + this.size + 'px)',
                'background': this.black,
                'width': (this.size) * 2 + 'px',
                'height': (this.size) * 2 + 'px'
            }
        };
        if(withWindow) {
            cssStyles = Object.assign(cssStyles, {
                '.escher_side:nth-child(4)::after': this.getWindow(this.size / 4, this.size / 2, this.size / 2.5, this.size / 1.25)
            });
        }
        return cssStyles;
    }
    getVariantE2() {
        let cssStyles = {
            /* Right */
            '.escher_side:nth-child(1)': {
                'transform': 'translateZ(-' + this.size + 'px)',
                'background': this.tan,
                'width': (this.size * 2) + 'px',
                'height': (this.size * 2) + 'px'
            },
            /* Left */
            '.escher_side:nth-child(2)': {
                'transform': 'rotateY(90deg) translateX(' + (this.size / 2) + 'px) translateY(-' + (this.size / 2) + 'px) translateZ(-' + this.size + 'px)',
                'background': this.black,
                'width': this.size + 'px',
                'height': this.size + 'px'
            },
            /* Small Cube (Top) */
            '.escher_side:nth-child(3)': {
                'transform': 'rotateX(90deg) translateX(-' + (this.size / 2) + 'px) translateY(-' + (this.size / 2)  + 'px)',
                'background': this.brick,
                'width': this.size + 'px',
                'height': this.size + 'px'
            },
            /* Small Cube (Right) */
            '.escher_side:nth-child(4)': {
                'transform': 'rotateY(90deg) translateX(' + (this.size / 2) + 'px) translateY(' + (this.size / 2) + 'px)',
                'background': this.black,
                'width': this.size + 'px',
                'height': this.size + 'px'
            }
        };
        return cssStyles;
    }
    getRows() {
        this.getFirstRow();
        this.getSecondRow();
        this.getThirdRow();
        this.getFourthRow();
    }
    getFirstRow() {
        let i,
            j,
            rules,
            parentSelector,
            childSelector,
            styles,
            combinedStyles = {
                '.escher_row:nth-child(4n-3) .escher_cube-holder:nth-child(3n-2) .escher_inverse-cube': this.getVariantA(this.brick, true),
                '.escher_row:nth-child(4n-3) .escher_cube-holder:nth-child(6n-4) .escher_inverse-cube': this.getVariantE1(this.brick, false),
                '.escher_row:nth-child(4n-3) .escher_cube-holder:nth-child(6n-1) .escher_inverse-cube': this.getVariantE1(this.greyStripes, true),
                '.escher_row:nth-child(4n-3) .escher_cube-holder:nth-child(3n-0) .escher_inverse-cube': this.getVariantE2()
            };
        for(i in combinedStyles) {
            let parentSelector = i,
                styles = combinedStyles[i];
            for(j in styles) {
                childSelector = j;
                rules = styles[j];
                this.cssStyles += styleToString({
                    [parentSelector + ' ' + childSelector]: rules
                });
            }
        }
    }
    getSecondRow() {
        let i,
            j,
            rules,
            parentSelector,
            childSelector,
            styles,
            combinedStyles = {
                '.escher_row:nth-child(4n-2) .escher_cube-holder:nth-child(6n-4) .escher_inverse-cube': this.getVariantA(this.greyStripes, false),
                '.escher_row:nth-child(4n-2) .escher_cube-holder:nth-child(6n-0) .escher_inverse-cube': this.getVariantA(this.greyStripes, false),
                '.escher_row:nth-child(4n-2) .escher_cube-holder:nth-child(6n-3) .escher_inverse-cube': this.getVariantA(this.brick, false),
                '.escher_row:nth-child(4n-2) .escher_cube-holder:nth-child(6n-1) .escher_inverse-cube': this.getVariantA(this.brick, false),
                '.escher_row:nth-child(4n-2) .escher_cube-holder:nth-child(6n-5) .escher_inverse-cube': this.getVariantB(true),
                '.escher_row:nth-child(4n-2) .escher_cube-holder:nth-child(6n-2) .escher_inverse-cube': this.getVariantB(false)
            };
        for(i in combinedStyles) {
            let parentSelector = i,
                styles = combinedStyles[i];
            for(j in styles) {
                childSelector = j;
                rules = styles[j];
                this.cssStyles += styleToString({
                    [parentSelector + ' ' + childSelector]: rules
                });
            }
        }
    }
    getThirdRow() {
        let i,
            j,
            rules,
            parentSelector,
            childSelector,
            styles,
            combinedStyles = {
                '.escher_row:nth-child(4n-1) .escher_cube-holder:nth-child(3n-2) .escher_inverse-cube': this.getVariantA(this.greyStripes, false),
                '.escher_row:nth-child(4n-1) .escher_cube-holder:nth-child(3n-1) .escher_inverse-cube': this.getVariantA(this.brick, false),
                '.escher_row:nth-child(4n-1) .escher_cube-holder:nth-child(3n-0) .escher_inverse-cube': this.getVariantC(false)
            };
        for(i in combinedStyles) {
            let parentSelector = i,
                styles = combinedStyles[i];
            for(j in styles) {
                childSelector = j;
                rules = styles[j];
                this.cssStyles += styleToString({
                    [parentSelector + ' ' + childSelector]: rules
                });
            }
        }
    }
    getFourthRow() {
        let i,
            j,
            rules,
            parentSelector,
            childSelector,
            styles,
            combinedStyles = {
                '.escher_row:nth-child(4n-0) .escher_cube-holder:nth-child(6n-5) .escher_inverse-cube': this.getVariantA(this.greyStripes, false),
                '.escher_row:nth-child(4n-0) .escher_cube-holder:nth-child(6n-4) .escher_inverse-cube': this.getVariantA(this.brick, false),
                '.escher_row:nth-child(4n-0) .escher_cube-holder:nth-child(6n-3) .escher_inverse-cube': this.getVariantD(this.greyStripes, this.brick),
                '.escher_row:nth-child(4n-0) .escher_cube-holder:nth-child(6n-2) .escher_inverse-cube': this.getVariantA(this.brick, true),
                '.escher_row:nth-child(4n-0) .escher_cube-holder:nth-child(6n-1) .escher_inverse-cube': this.getVariantA(this.brick, false),
                '.escher_row:nth-child(4n-0) .escher_cube-holder:nth-child(6n-0) .escher_inverse-cube': this.getVariantD(this.brick, this.greyStripes)
            };
        for(i in combinedStyles) {
            let parentSelector = i,
                styles = combinedStyles[i];
            for(j in styles) {
                childSelector = j;
                rules = styles[j];
                this.cssStyles += styleToString({
                    [parentSelector + ' ' + childSelector]: rules
                });
            }
        }
    }
    init() {
        this.cssStyles += styleToString({
            '.escher_container': {
        		'position': 'absolute',
        		'z-index': -2,
        		'left': 0,
        		'right': 0,
				'display': 'flex',
				'align-items': 'center',
				'justify-content': 'center',
				'height': '100%',
				'overflow': 'hidden',
				'background-color': this.bgColor,
				'animation-duration': '3s',
				'animation-name': 'zoom-out',
				'animation-iteration-count': 1,
				'animation-timing-function': 'ease-in-out'
            }
        });
        this.cssStyles += styleToString({
            '.escher_frame': {
                'border': (size * 4) + 'px solid ' + this.bgColor,
                'width': this.columnWidth * (this.numberOfColumns - 1) + 'px',
                'height': this.escher_rowHeight * (this.numberOfRows - 1) + 'px'
            }
        });
        this.cssStyles += styleToString({
            '.escher_row': {
                'position': 'relative',
                'z-index': -1,
                'left': '-' + (this.columnWidth / 2) + 'px',
                'top': '-' + (this.escher_rowHeight / 2) + 'px',
                'display': 'flex', 
            }
        });
        this.cssStyles += styleToString({
            '.escher_row:nth-child(2n)': {
                'margin-left': this.columnWidth / 2 + 'px'
            }
        });
        this.cssStyles += styleToString({
            '.escher_cube-holder': {
                'width': this.columnWidth + 'px',
                'height': this.escher_rowHeight + 'px',
            }
        });
        this.cssStyles += styleToString({
            '.escher_inverse-cube': {
                'width': 'inherit',
                'height': 'inherit',
                'transform-origin': 'center center',
                'transform-style': 'preserve-3d',
                'transform': 'rotateX(-35deg) rotateY(-45deg)', // Base rotation
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            }
        });
        this.cssStyles += styleToString({
            '.escher_side':  {
                'position': 'absolute'
            }
        });
        this.getRows();
        this.render();
    }
    render() {
        const style = document.createElement('style');
        style.innerHTML = this.cssStyles;
        document.head.appendChild(style);
    }
};
/**
 * Escher HTML.
 */
class escherHtml {
    constructor() {
        this.htmlString = '';
    }
    init() {
        let i,
            j,
            k;
        this.htmlString = '<div class="escher_container">' + "\n" +
            '<div class="escher_frame">' + "\n";
        for(i=0; i<13; i++) {
            this.htmlString += '<div class="escher_row">' + "\n";
            for(j=0; j<15; j++) {
                this.htmlString += '<div class="escher_cube-holder">' + "\n" +
                    '<div class="escher_inverse-cube">' + "\n";
                for(k=0; k<6; k++) {
                    this.htmlString += '<div class="escher_side"></div>' + "\n";
                }
                this.htmlString += '</div>' + "\n" +
                    '</div>' + "\n";
            }
            this.htmlString += '</div>' + "\n";
        }
        this.htmlString += '</div>' + "\n" +
            '</div>' + "\n";
        this.render();
    }
    render() {
        document.body.appendChild(this.htmlString.toDOMElements());
    }
}
let size = 30,
    bgColor = '#6223D2',
    tan = '#ff66cc',
    black = '#6223D2',
    brick = '#6666ff',
    grey = '#66ffcc',
    greyStripes = 'repeating-linear-gradient(90deg, ' + grey + ' 1px, ' + addAlpha(grey, 15) +' 1px, ' + addAlpha(grey, 1) + ' 2px)',
    escherCss = new escherCssStyles(size, bgColor, tan, black, brick, grey, greyStripes);
escherCss.init();
let escher = new escherHtml();
escher.init();