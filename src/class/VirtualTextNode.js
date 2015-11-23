//VirtualTextNode are lightweight replacements for real DOM elements, they allow us to easily
//move, remove, delete elements around our "virtual DOM" without needing real DOM elements
//we can they find their text string for when we want to renderToString()
function VirtualTextNode(nodeValue) {

    return {
        nodeValue: nodeValue
    }
}

export default VirtualTextNode;