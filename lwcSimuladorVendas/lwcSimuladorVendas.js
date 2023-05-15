import { LightningElement, wire } from 'lwc';
import produtosObj from '@salesforce/apex/ClassPegarProdutos.pegarProdutosMeuCarrinho';//Classe Apex consulta SOQL
import banner1 from '@salesforce/resourceUrl/LogoMeuCarrinhoLWC';//importar a imagem do meu carrinho no sistema

export default class lwcSimuladorVendas extends LightningElement {
    //INICIO DE VARIAVEIS USADAS
    productOptions = [];//
    selecionaIdProduto;//o indiano explicou que aqui vai ficar os meusregistro que foram importados na classe fazer isso por um evento peg Id
    productsData;//variavel que vai receber os dados da minha classe Apex de Product2(Objeto Salesforce)
    selectedProduct = {};//Aqui vai pegar o registro adicionado no combobox que é da minnha classe apex e seta-los aqui
    produtoQuantidade = 1;//ao selecionar o valor vai ficar setado por padrão como 1 no minimo 1 produto tem que ser colocado na simulação
    productTotal = 0;
    itenscarrinho = [];//todos os produtos adicionados pelo botão ficam aqui
    //FIM DE VARIAVEIS USADAS
//pegar todos os registros trazidos da minha class query
    @wire(produtosObj)
//função que vai verificar que os dados estão sendo carregados ou não - ajuda para saber pq os registros de produto não aparecem
    products({ error, data }) {
        if (data) {//se os dados carregarem vai acontecer o seguinte:
            this.productsData = data;//adicionar os dados nessa variavel - para ser usada no restante do código
            this.productOptions = data.map(product => ({//no forum me deram a ideia de carregar tudo em um map para poder usar a procura de chave e valor
                label: product.Name,
                value: product.Id
            }));
        } else if (error) {
            console.error(error);//erro vai aparecer no console caso não apareça os dados - e informar o pq(tava tendo erro na minha classe apex)
        }
    }
//vai ser chamado no meu combobox para carregar todos os registros(Produtos) e mostrar eles.
    handleProdutosApex(event) {
        this.selecionaIdProduto = event.target.value;
        if (this.productsData) {
            this.selectedProduct = this.productsData.find(product => product.Id === this.selecionaIdProduto);
            this.calculaTotalProduto();//para quando o produto for selecionado no combobox já chamar a funçao de calcular total
        }
    }

    handleQuantidade(event) {
        this.produtoQuantidade = parseInt(event.target.value);//pegar a quantidade como inteiro por algum motivo se tirar o parseInt da ruim
        this.calculaTotalProduto();
    }

    calculaTotalProduto() {
        this.productTotal = this.selectedProduct.Preco__c * this.produtoQuantidade;
    }

    handleAddSimulacao() {
        if (this.selecionaIdProduto && this.produtoQuantidade > 0 && this.productTotal > 0) {
            this.itenscarrinho.push({
                Id: this.selecionaIdProduto,
                Nome: this.selectedProduct.Name,
                Preco: `R$ ${parseFloat(this.selectedProduct.Preco__c).toFixed(2)}`,
                Quantidade: this.produtoQuantidade,
                Total: parseFloat(this.productTotal)
            });
            this.selecionaIdProduto = '';
            this.selectedProduct = {};
            this.produtoQuantidade = 1;
            this.productTotal = 0;
        }
    }

    handleDeletaItem() {
        if (this.itenscarrinho.length > 0) {
            this.itenscarrinho.pop();
        }
    }

    get carrinhoTotal() {
        return `R$ ${this.itenscarrinho.reduce((total, item) => total + item.Total, 0).toFixed(2).toLocaleString()}`;//consegui colocar para real PRONTO!
    }
    //vai pegar a imagem que salvamos na org
    get imgCarrinho(){
        return banner1;
    }
}