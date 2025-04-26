import React, { useState } from "react";
import "./styles.css";
import InputField from "./components/Input";
import SubmitButton from "./components/BotaoSubmit";

interface EmpresaData {
  nome: string;
  cep: string;
  endereco: string;
  bairro: string;
  fone: string;
}

function App() {
  const [identificacao, setIdentificacao] = useState("");
  const [dados, setDados] = useState<EmpresaData>({
    nome: "",
    cep: "",
    endereco: "",
    bairro: "",
    fone: "",
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<any>(null);

  function handleIdentificacaoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "");
    setIdentificacao(value);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let novoValor = value;

    if (name === "nome") novoValor = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    if (name === "cep" || name === "fone") novoValor = value.replace(/\D/g, "");

    setDados({ ...dados, [name]: novoValor });
  }

  async function carregarDados() {
    setErro("");
    setMostrarFormulario(false);
    setResultado(null);

    if (identificacao.length !== 11 && identificacao.length !== 14) {
      setErro("Digite um CPF (11) ou CNPJ (14) válido, sem pontos ou traços.");
      return;
    }

    try {
      const response = await fetch(
        `https://beta-api.serverlondrisoft.com:9000/disponibilizadados/cliente/?cnpjCpf=${identificacao}`,
        {
          headers: {
            GatewayLS: "2e44bb6339e6aacd8faeca8fd4e8694e",
            identificacao: identificacao,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar dados");

      const data = await response.json();

      setDados({
        nome: data.nome || "",
        cep: data.cep || "",
        endereco: data.endereco || "",
        bairro: data.bairro || "",
        fone: data.fone || "",
      });

      setMostrarFormulario(true);
    } catch {
      setErro("Erro ao buscar dados. Verifique o CNPJ/CPF.");
    }
  }

  function atualizarDados() {
    if (!dados.nome || !dados.fone) {
      setErro("Preencha os campos obrigatórios: nome e fone.");
      return;
    }

    const final = {
      identificacao,
      ...dados,
    };

    setResultado(final);
    setErro("");
    setIdentificacao("");
    setDados({
      nome: "",
      cep: "",
      endereco: "",
      bairro: "",
      fone: "",
    });
    setMostrarFormulario(false);
  }

  return (
    <div className="container">
      <h1>Atualizar Empresa</h1>

      <InputField
        label="CNPJ ou CPF"
        name="identificacao"
        value={identificacao}
        onChange={handleIdentificacaoChange}
        placeholder="Digite sem pontos ou traços"
      />
      <SubmitButton label="Carregar Dados" onClick={carregarDados} />

      {erro && <p className="error">{erro}</p>}

      {mostrarFormulario && (
        <>
          <InputField
            label="Nome"
            name="nome"
            value={dados.nome}
            onChange={handleInputChange}
            placeholder="Nome da empresa"
          />
          <InputField
            label="CEP"
            name="cep"
            value={dados.cep}
            onChange={handleInputChange}
            placeholder="Somente números"
          />
          <InputField
            label="Endereço"
            name="endereco"
            value={dados.endereco}
            onChange={handleInputChange}
            placeholder="Rua, número..."
          />
          <InputField
            label="Bairro"
            name="bairro"
            value={dados.bairro}
            onChange={handleInputChange}
            placeholder="Nome do bairro"
          />
          <InputField
            label="Fone"
            name="fone"
            value={dados.fone}
            onChange={handleInputChange}
            placeholder="Somente números"
          />
          <SubmitButton label="Atualizar Dados" onClick={atualizarDados} />
        </>
      )}

      {resultado && (
        <div className="result-box">
          <h3>Dados Atualizados:</h3>
          <div className="result-list">
            {Object.entries(resultado).map(([chave, valor]) => (
              <div key={chave} className="result-item">
                <span className="result-key">{chave}:</span>
                <span className="result-value">{String(valor)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default App;
