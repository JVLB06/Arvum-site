<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class AppController extends Controller {
    // Acessos padrão às APIs
    private $api_erp = "http://192.168.0.200:5001";
    // Geração de frases por meio de APIs
    private function httpRequest($url, $data = null) {
        $ch = curl_init();
    
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    
        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        }
    
        $response = curl_exec($ch);
    
        if (curl_errno($ch)) {
            echo 'Erro na requisição: ' . curl_error($ch);
        }
    
        curl_close($ch);
    
        return $response;
    }
    private function select_busca(){
        // Tags e autores para busca
        $tags = ["leadership","succes","motivation","inspiration","knowledge","strategy","self-improvement"];
        $autores = ["socrates","marcus-aurelius","napoleon-hill","michelle-obama","napoleon","pope-paul-vi","george-orwell","pope-john-xxiii","steve-jobs","leonardo-da-vinci","albert-einstein","winston-churchill","immanuel-kant","voltaire","plato","bruce-lee","george-washington","aristotle","alexander-the-great","j-r-r-tolkien"];
        // Decide se busca por tag ou autor (50% de chance para cada)
        if (rand(0, 1) === 0) {
            $escolhido = $tags[array_rand($tags)];  // Escolhe uma tag aleatória
            return ["tipo" => "tags", "valor" => $escolhido];
        } else {
            $escolhido = $autores[array_rand($autores)];  // Escolhe um autor aleatório
            return ["tipo" => "author", "valor" => $escolhido];
        }
    }
    private function obterFrase(){   
        // API pública de frases
        $buscador = $this->select_busca();
        if ($buscador["tipo"] == "tags"){
            $response = $this->httpRequest('https://api.quotable.io/quotes?query='.$buscador["valor"]);
        } else{
            $response = $this->httpRequest('https://api.quotable.io/quotes?author='.$buscador["valor"]);
        }
        // Obtém a frase a ser traduzida
        $frase_group = json_decode($response, true);
        $data = $frase_group["results"][array_rand($frase_group["results"])];
        $fraseEmIngles = $data['content'];
        $autor = $data['author'];
        // Alternativa (rodar localmente o libretranslate)
        // Traduz a frase para português usando a API do Lingva Translate
        $traducaoResponse = $this->httpRequest("https://lingva.ml/api/v1/en/pt/" . urlencode($fraseEmIngles));
        // Converte a resposta JSON em um array associativo
        $traducaoData = json_decode($traducaoResponse, true);
        // Obtém a tradução
        if (isset($traducaoData['translation'])) {
            $content = str_replace("+", " ", $traducaoData['translation']);
            $content = '"'. $content . '"';
        } else {
            $content = "Hoje você terá que pensar em uma frase você mesmo";
        }
        $resp = ["content"=>$content, "author"=>$autor];
        return $resp;
    }
    public function get_token() {
        $token = session('token'); // Recupera o token da sessão
        if (!$token) {
            return redirect()->route('login')->with('error', 'Sessão expirada! Faça login novamente.');
        }
        else {
            return $token; // Retorna o token se estiver disponível
        }
    }



    // Telas de cadastros
    public function cadastrar_extrato(Request $request) {
        $tkn = $this->get_token();
        if ($request->isMethod('post') && $request->has('submit')) {
            $valor = $request->input('extrato_cad_vlr');
            $date = $request->input('extrato_cad_data');
            $historico = $request->input('extrato_cad_hist');
            // Incluir conexão com as demais tabelas para lançar automático. 

            $id = $request->input('extrato_cad_id');
            $tipo = $request->input('extrato_cad_tipo');

            $output = ["data" => $date, "vlr" => $valor, "historico" => $historico];
            

            $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/extrato/incluir_lancamento", $output);
            $especifico = [$tipo . "_id" => $id, "lcto_id" => $response['id_lcto'], "data" => $data, "valor" => $valor, "historico" => $historico];
            switch($tipo) {
                case "gasto":
                    $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user/user/dados/pgto_gasto/post", $output);
                case "divida":
                    $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user/user/dados/pgto_divida/post", $output);
                case "meta":
                    $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user/user/dados/pgto_meta/post", $output);
                case "investimento":
                    $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user/user/dados/meta_invest/post", $output); 
            }
        }

        // Configurar input de dados de todas as tabelas para auto fill
        $renda = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/api/user/user/dados/renda/get")->json();
        $gasto = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/api/user/user/dados/gasto/get")->json();
        $investimento = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/api/user/user/dados/investimento/get")->json();
        $divida = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/api/user/user/dados/divida/get")->json();

        $data = [$renda, $gasto, $investimento, $divida];

        return view("cadastrar_extrato", compact('data'));
    }

    // Dashboard
    public function dashboard(Request $request) {
        $tkn = $this->get_token();
        $renda = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/user_plan/ler_renda")->json();
        $gasto = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/user_plan/ler_gastos")->json();
        $investimento = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/user_plan/ler_investimentos_ativos")->json();
        $divida = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/user_plan/ler_dividas")->json();
        // Somando os valores de cada categoria
        $total_renda = array_sum(array_column($renda, 'vlr'));
        $total_gasto = array_sum(array_column($gasto, 'vlr'));
        $total_investimento = array_sum(array_column($investimento, 'vlr'));
        $total_divida = array_sum(array_column($divida, 'vlr'));
        $frase = $this->obterFrase();
        $data = [
            'renda' => $total_renda,
            'gasto' => $total_gasto,
            'investimento' => $total_investimento,
            'divida' => $total_divida
        ];
        return view("dashboard", compact('data', 'frase'));
    }
    // Cadastrar divida
    public function cadastrar_divida(Request $request) {
        $tkn = $this->get_token();
        if ($request->isMethod('post') && $request->has('submit')){
            $nome = $request->input('divida_cad_nome');
            $data_in = $request->input('divida_cad_data_init');
            $data_fim = $request->input('divida_cad_data_fim');
            $valor = $request->input('divida_cad_vlr');
            $output = ["data_init" => $data_in, "vlr" => $valor, "descricao" => $nome, "data_venc" => $data_fim];
            $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user-plan/criar_divida", $output);
        }
        return view('cadastrar_divida');
    }
    // cadastrar_gasto
    public function cadastrar_gasto(Request $request) {
        $tkn = $this->get_token();
        if ($request->isMethod('post') && $request->has('submit')){
            $nome = $request->input('gasto_cad_nome');
            $vlr_min = $request->input('gasto_cad_vlr_min');
            $vlr_max = $request->input('gasto_cad_vlr_max');
            $data = $request->input('gasto_cad_data');
            $prioridade = $request->input('gasto_cad_prioridade');
            $fixvar = $request->input('gasto_cad_fixvar');
            if ($fixvar == "fixo"){
                $fixvar = True;
            }
            else {$fixvar = False;}
            $output = ["descricao"=>$nome,
            "vlr_min"=>$vlr_min,
            "vlr_max"=>$vlr_max,
            "data"=>$data,
            "prioridade"=>$prioridade,
            "fixvar"=>$fixvar];
            $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user_plan/criar_gasto", $output);
        }
        return view("cadastrar_gasto");
    }
    // cadastrar_investimento
    public function cadastrar_investimento(Request $request) {
        $tkn = $this->get_token();
        if ($request->isMethod('post') && $request->has('submit')){
            $nome = $request->input('investimento_cad_nome');
            $data_init = $request->input('investimento_cad_data_init');
            //$data_fim = $request->input('investimento_cad_data_fim');
            $valor = $request->input('investimento_cad_vlr');
            $juro = $request->input('investimento_cad_juros');
            $output = ["descricao"=>$nome,
                "data_init"=>$data_init,
                "vlr"=>$valor,
                "juro"=>$juro];
            $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user_plan/criar_investimento", $output);
        }
        return view("cadastrar_investimento");
    }
    // cadastrar_renda
    public function cadastrar_renda(Request $request) {
        $tkn = $this->get_token();
        if ($request->isMethod('post') && $request->has('submit')){
            $nome = $request->input('renda_cad_nome');
            $valor = $request->input('renda_cad_vlr');
            $data = $request->input('renda_cad_data');
            $output = ["descricao"=>$nome,"data"=>$data,"vlr_min"=>$valor, "vlr_max"=>$valor];
            $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user_plan/criar_renda", $output);
        }
        return view("cadastrar_renda");
    }
    // cadastrar_meta
    public function cadastrar_meta(Request $request) {
        $tkn = $this->get_token();
        if ($request->isMethod('post') && $request->has('submit')){
            $nome = $request->input('meta_cad_nome');
            $valor = $request->input('meta_cad_vlr');
            $data = $request->input('meta_cad_data');
            $output = ["descricao"=>$nome,"data_prev"=>$data,"vlr"=>$valor];
            $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->post($this->api_erp . "/user_plan/criar_meta", $output);
        }
        return view("cadastrar_meta");
    }

    // Input do usuário
    // Tela de login
    public function login(Request $request) {
        if ($request->isMethod('post')){
            $user = $request->input("login_user");
            $password = $request->input("login_senha");
            $output = ["username"=>$user, "password"=>$password];
            $response = Http::post($this->api_erp . "/contas/login", $output);
            if ($response->successful()) {
                // Redireciona para a dashboard
                $data = $response->json();
                $token = $data['access_token'] ?? null;
                if ($token) {
                    session(['token' => $token]);
                    return redirect()->route('dashboard');
                }
            } else {
                return redirect()->route('login')->with('error', 'Credenciais inválidas!');
            }
        }
        $obter = $this->obterFrase();
        return view(("login"), ['obter'=>$obter]);
    }
    // Cadastro do usuário
    public function cadastro(Request $request) {
        if ($request->isMethod('post') && $request->has('submit')){
            $user = $request->input("cadastro_nome");
            $email = $request->input("cadastro_email");
            $nasce = $request->input("cadastro_nasce");
            $password = $request->input("cadastro_senha");
            $conf = $request->input("cadastro_confirma_senha");
            if ($password == $conf){
                $output = ["username"=>$user, "password"=>$password, "email"=>$email, "nasce"=>$nasce];
                $response = Http::post($this->api_erp . "/contas/cadastro", $output);
                if ($response->successful()) {
                    return redirect()->route('/login')->with('success', 'Cadastro realizado! Faça login.');
                } else {
                    return redirect()->route('/cadastro')->with('error', 'Erro ao cadastrar. Tente novamente.');
                }
            } else {
                return redirect()->route('/cadastro')->with('error', 'As senhas não coincidem.');
            }
        }
        $obter = $this->obterFrase();
        return view(("cadastro"), compact("obter"));
    }
    public function home() {
        return view('index');
    }
    // Telas de visualização
    public function extrato(Request $request) {
        $tkn = $this->get_token();
        $dataInicio = $request->input('data_inicio');
        $dataFim = $request->input('data_fim');
        $filtros = $request->input('filtros', []);
        // Definição das rotas para cada filtro
        $rotas = [
            'renda' => '/extrato/obter_renda_pgto',
            'gastos' => '/extrato/obter_gastos_pgto',
            'investimentos' => '/extrato/obter_investimento_pgto',
            'meta' => '/extrato/obter_meta_pgto',
            'divida' => '/extrato/obter_divida_pgto'
        ];
        $dadosCombinados = [];
        if (count($filtros) > 0) {
            // Buscar dados de cada filtro selecionado
            foreach ($filtros as $filtro) {
                if (isset($rotas[$filtro])) {
                    $respostaApi = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->$api_erp . $rotas[$filtro]);
                    if ($respostaApi->successful()) {
                        $dados = $respostaApi->json();
                        $dadosCombinados = array_merge($dadosCombinados, $dados);
                    }
                }
            }
        } else {
            $respostaApi = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . $rotas["renda"]);
            if (empty($respostaApi->json())) {
                $dadosCombinados = [['mensagem' => 'Nenhum dado encontrado']];
            } else {
            $dadosCombinados = array_merge($dadosCombinados, $respostaApi->json());
            }
        }
        // Aplicar filtro de data se informado
        if ($dataInicio && $dataFim) {
            $dadosCombinados = array_filter($dadosCombinados, function ($item) use ($dataInicio, $dataFim) {
                return ($item['data'] >= $dataInicio && $item['data'] <= $dataFim);
            });
        }
        $values = [response()->json(array_values($dadosCombinados))];
        if (empty($values)) {
            $values = [["data" => "01/01/2025", "historico" => "Nada", "vlr" => 0, "id" => 0]]; // Garante que seja um array vazio em caso de falha
        }
        return view('extrato', compact('values'));      
    }
    public function renda(Request $request) {
        $tkn = $this->get_token();
        $respostaApi = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/user_plan/ler_renda");
        if ($respostaApi->successful()) {
            $data = $respostaApi->json();
            if ($data["listagem"] != []) {
                $data['vlr'] = ($data['vlr_min'] + $data['vlr_max']) / 2; // Calcular a média entre vlr_min e vlr_max
            }
            else {
                $data = [["nome" => 'Nenhum dado encontrado', "data" => "0000-00-00", "vlr" => 0]];
            } 
        } else {
            $data = [["nome" => 'Nenhum dado encontrado', "data" => "0000-00-00", "vlr" => 0]];
        }
        $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/api/user/user/dados/extrato/get");
        $extratos = $response->successful() ? $response->json() : [];
        if ($extratos['listagem'] == []) {
            $extratos = [['nome' => "nada", "vlr" => 0, 'data' => "01/01/2025"]]; // Garante que seja um array vazio em caso de falha
        }
        // Definir a data mínima (12 meses atrás)
        $dataMinima = Carbon::now()->subMonths(12)->startOfMonth();
        // Filtrar apenas os últimos 12 meses e valores positivos
        $rendasFiltradas = array_filter($extratos, function ($item) use ($dataMinima) {
            return Carbon::parse($item['data'])->greaterThanOrEqualTo($dataMinima) && $item['vlr'] > 0;
        });
        // Agrupar por mês e somar os valores
        $antes = [];
        foreach ($rendasFiltradas as $item) {
            $mes = Carbon::parse($item['data'])->format('M/Y'); // Formato "Abr/2024"
            $antes[$mes] = ($antes[$mes] ?? 0) + $item['vlr'];
        }
        // Ordenar os meses para manter a ordem cronológica
        uksort($antes, function ($a, $b) {
            return strtotime("01 $a") - strtotime("01 $b");
        });
        return view('renda', compact('data', 'antes'));
    }
    // Gasto
    public function gasto(Request $request) {
        $tkn = $this->get_token();
        // Obter todos os gastos
        $respostaApi = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->$api_erp . "/user_plan/ler_gastos");
        if ($respostaApi->successful()) {
            $data = $respostaApi->json();
        } else {
            $data = [['mensagem' => 'Nenhum dado encontrado', "data" => "0000-00-00", "vlr" => 0]];
        }

        // Obter gastos de cada mês
        $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/extrato/obter_gastos_pgto");
        $extratos = $response->json(); // Converter para array associativo
        // Definir a data mínima (12 meses atrás)
        $dataMinima = Carbon::now()->subMonths(12)->startOfMonth();
        // Filtrar apenas os últimos 12 meses
        $gastosFiltrados = array_filter($extratos, function ($item) use ($dataMinima) {
            return Carbon::parse($item['data'])->greaterThanOrEqualTo($dataMinima);
        });
        // Agrupar por mês e somar os valores (todos negativos)
        $antes = [];
        foreach ($gastosFiltrados as $item) {
            $mes = Carbon::parse($item['data'])->format('M/Y'); // Formato "Abr/2024"
            $antes[$mes] = ($antes[$mes] ?? 0) + $item['valor'];
        }
        // Ordenar os meses cronologicamente
        uksort($antes, function ($a, $b) {
            return strtotime("01 $a") - strtotime("01 $b");
        });


        // Obter estimativa ideal de gastos
        $response = Http::withHeaders(['Authorization' => "Bearer $tkn"])->get($this->api_erp . "/api/user/user/dados/extrato/get");
        $extratos = $response->json(); // Converter para array associativo
        // Definir a data mínima (12 meses atrás)
        $dataMinima = Carbon::now()->subMonths(12)->startOfMonth();
        // Filtrar apenas os últimos 12 meses e valores positivos
        $rendasFiltradas = array_filter($extratos, function ($item) use ($dataMinima) {
            return Carbon::parse($item['data'])->greaterThanOrEqualTo($dataMinima) && $item['valor'] > 0;
        });
        // Agrupar por mês e somar os valores
        $meta = [];
        foreach ($rendasFiltradas as $item) {
            $mes = Carbon::parse($item['data'])->format('M/Y'); // Formato "Abr/2024"
            $meta[$mes] = ($meta[$mes] ?? 0) + $item['valor'];
        }
        // Ordenar os meses para manter a ordem cronológica
        uksort($meta, function ($a, $b) {
            return strtotime("01 $a") - strtotime("01 $b");
        });
        $estimate = [];
        foreach ($meta as $mes => $valor) {
            $estimate[$mes] = $valor * 0.7; // Calcula 70%
        }
        return view('renda', compact('data', 'antes', 'estimate'));
    }
    // Dívida

    // Meta
    // Investimento

    // Telas de edição (sem rota)
    // Editar_extrato
    // Editar_renda
    // Editar_gasto
    // Editar_divida
    // Editar_meta
    // Editar_investimento

    // Logout (sem rota)
        // Remover o token da sessão do cache (encerrando o acesso)
}
?>
