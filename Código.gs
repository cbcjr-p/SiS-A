// Configurações das planilhas
const PLANILHA_LOGIN_ID = "1xE__Yn7bPQM2bNCy4YISU14nwn_y02WNG1PVg1jX-H4";
//const PLANILHA_CLIENTES_ID = "1MjSqFA1I9Q88U9MgM9KbFpdEDoB4t6zB9xYbC-AMzZ8";
//const PLANILHA_PRODUTOS_ID = "1DyL_NkORQ4MzSXIYLTYTNXwUzIzVKpABtugIzUFYSik";
//const PLANILHA_PEDIDOS_ID = "1DyL_NkORQ4MzSXIYLTYTNXwUzIzVKpABtugIzUFYSik";
const PLANILHA_Acesso_ID = "1oSk488bY4nuPbTI6QxzF6w0AD9A8-Mi3zZIuCCyyusA";
//const webURL = "";

//Planilha clientes
//const planClientesAbaCadastro = SpreadsheetApp.openById(PLANILHA_CLIENTES_ID).getSheetByName("Cadastro");
//const planClientesAbaClientes = SpreadsheetApp.openById(PLANILHA_CLIENTES_ID).getSheetByName("Clientes");
//const planClientesAbaClientesPrecos = SpreadsheetApp.openById(PLANILHA_CLIENTES_ID).getSheetByName("ClientesPreços");

//Planilha Pedidos
//const planPedidosAbaPedidos = SpreadsheetApp.openById(PLANILHA_PEDIDOS_ID).getSheetByName("Pedidos");

//Planilha Produtos
//const planProdutosAbaProdutos = SpreadsheetApp.openById(PLANILHA_PRODUTOS_ID).getSheetByName("Produtos");

//Planilha Login
const planLoginAbaLogin = SpreadsheetApp.openById(PLANILHA_LOGIN_ID).getSheetByName("Login");

//Planilha Acesso
const planAcessoAbaAcessando = SpreadsheetApp.openById(PLANILHA_Acesso_ID).getSheetByName("Acessando");
const planAcessoAbaAcessou = SpreadsheetApp.openById(PLANILHA_Acesso_ID).getSheetByName("Acessou");

//Dados para o sistema
//const dadosPlanClientesAbaCadastro = planClientesAbaCadastro.getDataRange().getValues();
//const dadosPlanClientesAbaClientes = planClientesAbaClientes.getDataRange().getValues();
//const dadosPlanClientesAbaClientesPrecos = planClientesAbaClientesPrecos.getDataRange().getValues();
//const dadosPlanPedidosAbaPedidos = planPedidosAbaPedidos.getDataRange().getValues();
//const dadosPlanProdutosAbaProdutos = planProdutosAbaProdutos.getDataRange().getValues();
const dadosPlanLoginAbaLogin = planLoginAbaLogin.getDataRange().getValues();
const dadosplanAcessoAbaAcessando = planAcessoAbaAcessando.getDataRange().getValues();
const dadosplanAcessoAbaAcessou = planAcessoAbaAcessou.getDataRange().getValues();

/**
 * A função principal para o aplicativo web.
 * @returns {HtmlOutput} O HTML para exibir.
 */
function doGet(e) {
  // Use 'let' para a variável 'page' para um melhor gerenciamento de escopo.
  const page = e.parameter.page;
  Logger.log(e);
  Logger.log(page);
  if (page === 'registro') {
    return HtmlService.createTemplateFromFile('registro').evaluate();
  } else if (page === 'main') {
    return HtmlService.createTemplateFromFile('main').evaluate();
  } else {
    // Se nenhum parâmetro de página for encontrado, ou se ele for inválido,
    // a página de login padrão será carregada.
    return HtmlService.createTemplateFromFile('login').evaluate();
  }
}






/**
 * Retorna a URL de implantação do script.
 * @returns {string} A URL do script.
 */
function myURL() {
  return ScriptApp.getService().getUrl();
}






function login_User(username, password) {
  //username = "Leda";
  //password = "3"

  const allData = dadosPlanLoginAbaLogin;
  Logger.log("allData "+allData);
  const userData = findUser(allData, username, password);
  Logger.log("userData "+userData);
  
  if (userData) {
    // Apaga sessões antigas
    //clearExpiredSessions();
    
    // Cria um token único e salva na planilha
    const sessionToken = Utilities.getUuid();
    Logger.log("sessionToken "+sessionToken);
    const expirationDate = new Date();
    Logger.log("expirationDate "+expirationDate);
    expirationDate.setHours(expirationDate.getHours() + 1); // Expira em 1 hora
    Logger.log("apendrow:  "+sessionToken+" "+userData[0]+" "+expirationDate.getTime());
    planAcessoAbaAcessando.appendRow([sessionToken, userData[0], expirationDate.getTime()]);
    planAcessoAbaAcessou.appendRow([sessionToken, userData[0], expirationDate.getTime()]);

    // Pausa por 1 segundo para garantir que a planilha salve a informação
    Utilities.sleep(1000); // 1000 milissegundos = 1 segundo
    
    Logger.log({ success: true, token: sessionToken, nome: userData[1],planID:userData[3], expira:expirationDate.getTime()});
    let response ={ 
      success: true,
      token: sessionToken,
      nome: userData[1],
      expira:expirationDate.getTime(),
      planID:userData[3]
      };

    return response;
    
  } else {
    return { success: false };
  }
}






//procura usuario e senah em data 
function findUser(data, pUID, pPassword) {
  Logger.log("findUser: "+data+" pUID: "+pUID+" pPassword: "+pPassword);
  for (let i = 1; i < data.length; i++) {
    Logger.log("i: "+i);
    const row = data[i];
    Logger.log("row: "+row);
    if (String(row[1]).trim() === pUID.trim() && String(row[2]).trim() === pPassword.trim()) {
      Logger.log("resultado do test "+row);
      return row;
    }
  }
  return null;
}






