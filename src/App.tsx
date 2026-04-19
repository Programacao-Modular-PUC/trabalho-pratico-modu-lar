import { useState } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Quarto {
  id: number;
  numero: string;
  tipo: string;
  valorBase: number;
  ar: boolean;
  hidro: boolean;
}

interface Residencia {
  id: number;
  nome: string;
  endereco: string;
  numero: string;
  bairro: string;
  cep: string;
  telefone: string;
  email: string;
  quartos: Quarto[];
}

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
}

interface Aluguel {
  id: number;
  clienteId: number;
  residenciaId: number;
  quartoId: number;
  entrada: string;
  saida: string;
  diarias: number;
  valorFinal: number;
  status: string;
}

interface BadgeProps {
  children: React.ReactNode;
  color?: "teal" | "green" | "amber" | "red" | "gray";
}

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface BtnProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: any[];
}

interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

interface StatusBadgeProps {
  status: string;
}

interface DashboardProps {
  residencias: Residencia[];
  clientes: Cliente[];
  alugueis: Aluguel[];
}

interface ResidenciasProps {
  residencias: Residencia[];
  setResidencias: React.Dispatch<React.SetStateAction<Residencia[]>>;
}
const C = {
  teal50: "#E1F5EE", teal100: "#9FE1CB", teal200: "#5DCAA5",
  teal400: "#1D9E75", teal600: "#0F6E56", teal800: "#085041", teal900: "#04342C",
  amber50: "#FAEEDA", amber100: "#FAC775", amber400: "#BA7517", amber800: "#633806",
  red50: "#FCEBEB", red800: "#791F1F",
  gray50: "#F1EFE8", gray100: "#D3D1C7", gray400: "#888780", gray600: "#5F5E5A",
  green50: "#EAF3DE", green800: "#27500A",
};

// ─── Dados iniciais ────────────────────────────────────────────────────────────
const RESIDENCIAS_INIT = [
  {
    id: 1, nome: "Residência Praiamar",
    endereco: "Rua das Flores", numero: "12", bairro: "Centro",
    cep: "45520-000", telefone: "(73) 98801-0001", email: "praiamar@email.com",
    quartos: [
      { id: 1, numero: "01", tipo: "Casal", valorBase: 200, ar: true, hidro: true },
      { id: 2, numero: "02", tipo: "Solteiro", valorBase: 120, ar: false, hidro: false },
      { id: 3, numero: "03", tipo: "Casal", valorBase: 160, ar: true, hidro: false },
    ],
  },
  {
    id: 2, nome: "Pousada Recifes",
    endereco: "Av. Beira Mar", numero: "88", bairro: "Barra Grande",
    cep: "45525-000", telefone: "(73) 98802-0002", email: "recifes@email.com",
    quartos: [
      { id: 4, numero: "01", tipo: "Solteiro", valorBase: 130, ar: true, hidro: false },
      { id: 5, numero: "02", tipo: "Casal", valorBase: 210, ar: true, hidro: true },
    ],
  },
];

const CLIENTES_INIT = [
  { id: 1, nome: "Ana Souza", cpf: "123.456.789-00", telefone: "(73) 98700-0001", email: "ana@email.com", endereco: "Rua A, 10, Centro, Salvador" },
  { id: 2, nome: "Carlos Melo", cpf: "987.654.321-00", telefone: "(73) 98700-0002", email: "carlos@email.com", endereco: "Av. B, 22, Barra, Salvador" },
  { id: 3, nome: "Beatriz Lima", cpf: "111.222.333-00", telefone: "(71) 99100-0003", email: "bea@email.com", endereco: "Rua C, 5, Itapuã, Salvador" },
];

const ALUGUEIS_INIT = [
  {
    id: 1, clienteId: 1, residenciaId: 1, quartoId: 2,
    entrada: "2025-04-10T12:00", saida: "2025-04-13T12:00",
    diarias: 3, valorFinal: 360, status: "Concluído",
  },
  {
    id: 2, clienteId: 2, residenciaId: 1, quartoId: 1,
    entrada: "2025-04-15T14:00", saida: "2025-04-18T10:00",
    diarias: 3, valorFinal: 600, status: "Ativo",
  },
  {
    id: 3, clienteId: 1, residenciaId: 2, quartoId: 5,
    entrada: "2025-04-20T12:00", saida: "2025-04-22T12:00",
    diarias: 2, valorFinal: 520, status: "Reservado",
  },
];

// ─── Utilitários ───────────────────────────────────────────────────────────────
function calcDiarias(entrada: string, saida: string): number {
  if (!entrada || !saida) return 0;
  const dtE = new Date(entrada);
  const dtS = new Date(saida);
  if (dtS <= dtE) return 0;
  const diffMs = dtS.getTime() - dtE.getTime();
  let dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (dtS.getHours() + dtS.getMinutes() / 60 > 12) dias += 1;
  return dias;
}

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDT(s: string): string {
  if (!s) return "—";
  return new Date(s).toLocaleString("pt-BR");
}

function calcValorDiaria(quarto: Quarto): number {
  let v = quarto.valorBase;
  if (quarto.ar) v += 30;
  if (quarto.hidro) v += 50;
  return v;
}

// ─── Componentes base ──────────────────────────────────────────────────────────
function Badge({ children, color = "teal" }: BadgeProps) {
  const palettes: Record<string, { bg: string; color: string }> = {
    teal: { bg: C.teal50, color: C.teal800 },
    green: { bg: C.green50, color: C.green800 },
    amber: { bg: C.amber50, color: C.amber800 },
    red: { bg: C.red50, color: C.red800 },
    gray: { bg: C.gray50, color: C.gray600 },
  };
  const p = palettes[color] || palettes.teal;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "3px 9px",
      borderRadius: 20, background: p.bg, color: p.color,
      display: "inline-block", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function Card({ children, style }: CardProps) {
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e0e0d8",
      borderRadius: 12, padding: "16px 20px", marginBottom: 14,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Btn({ children, primary, onClick, style }: BtnProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "8px 18px", fontSize: 13, fontWeight: 500,
        borderRadius: 8, cursor: "pointer",
        border: primary ? "none" : "0.5px solid #ccc",
        background: primary
          ? hover ? C.teal600 : C.teal400
          : hover ? "#f5f5f0" : "transparent",
        color: primary ? "#fff" : "#333",
        transition: "all 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, options }: InputProps) {
  const baseStyle = {
    padding: "7px 10px", fontSize: 13, width: "100%",
    border: "0.5px solid #ccc", borderRadius: 8,
    background: "#fff", color: "#333", outline: "none",
    fontFamily: "inherit",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 12, color: C.gray600 }}>{label}</label>}
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={baseStyle}>
          {options.map((o: any) => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)} style={baseStyle}
        />
      )}
    </div>
  );
}

function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
      {tabs.map((t: Tab) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "5px 14px", fontSize: 12, fontWeight: 500,
            borderRadius: 20, cursor: "pointer",
            border: active === t.id ? "none" : "0.5px solid #ccc",
            background: active === t.id ? C.teal400 : "transparent",
            color: active === t.id ? "#fff" : C.gray600,
            transition: "all 0.15s",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, string> = {
    "Concluído": "green", "Ativo": "amber", "Reservado": "teal",
    "Disponível": "green", "Ocupado": "red", "Reservado ": "amber",
  };
  return <Badge color={map[status] as BadgeProps['color'] || "gray"}>{status}</Badge>;
}

// ─── SEÇÃO: Dashboard ──────────────────────────────────────────────────────────
function Dashboard({ residencias, clientes, alugueis }: DashboardProps) {
  const totalQuartos = residencias.reduce((a: number, r: Residencia) => a + r.quartos.length, 0);
  const ativos = alugueis.filter((a: Aluguel) => a.status === "Ativo" || a.status === "Reservado").length;

  const quartosStatus = residencias.flatMap((r: Residencia) =>
    r.quartos.map((q: Quarto) => {
      const aluguelAtivo = alugueis.find(
        (a: Aluguel) => a.quartoId === q.id && (a.status === "Ativo" || a.status === "Reservado")
      );
      return {
        ...q, residenciaNome: r.nome,
        status: aluguelAtivo ? aluguelAtivo.status : "Disponível",
      };
    })
  );

  const metrics = [
    { label: "Residências", value: residencias.length },
    { label: "Quartos totais", value: totalQuartos },
    { label: "Clientes", value: clientes.length },
    { label: "Reservas ativas", value: ativos },
  ];

  return (
    <div>
      <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Visão geral</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginBottom: 18 }}>
        {metrics.map((m: any) => (
          <div key={m.label} style={{ background: "#f5f5f0", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: C.gray600, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: C.teal600 }}>{m.value}</div>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Disponibilidade dos quartos</div>
        {quartosStatus.map((q: any, i: number) => (
          <div key={q.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i < quartosStatus.length - 1 ? "0.5px solid #eee" : "none",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Quarto {q.numero} — {q.tipo}</div>
              <div style={{ fontSize: 11, color: C.gray600, marginTop: 2 }}>
                {q.residenciaNome}{q.ar ? " · ar" : ""}{q.hidro ? " + hidromassagem" : ""}
              </div>
            </div>
            <StatusBadge status={q.status} />
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── SEÇÃO: Residências ────────────────────────────────────────────────────────
function Residencias({ residencias, setResidencias }: ResidenciasProps) {
  const [tab, setTab] = useState("lista");
  const [form, setForm] = useState({ endereco: "", numero: "", bairro: "", cep: "", telefone: "", email: "", nome: "" });
  const [qForm, setQForm] = useState({ residenciaId: "", numero: "", tipo: "Solteiro", valorBase: "", ar: false, hidro: false });

  const salvarResidencia = () => {
    if (!form.nome || !form.endereco) return alert("Preencha nome e endereço.");
    const nova: Residencia = { ...form, id: Date.now(), quartos: [] };
    setResidencias((prev: Residencia[]) => [...prev, nova]);
    setForm({ endereco: "", numero: "", bairro: "", cep: "", telefone: "", email: "", nome: "" });
    alert("Residência cadastrada!");
    setTab("lista");
  };

  const salvarQuarto = () => {
    if (!qForm.residenciaId || !qForm.numero || !qForm.valorBase) return alert("Preencha todos os campos.");
    const quarto: Quarto = {
      id: Date.now(), numero: qForm.numero, tipo: qForm.tipo,
      valorBase: parseFloat(qForm.valorBase), ar: qForm.ar, hidro: qForm.hidro,
    };
    setResidencias((prev: Residencia[]) => prev.map((r: Residencia) =>
      r.id === parseInt(qForm.residenciaId) ? { ...r, quartos: [...r.quartos, quarto] } : r
    ));
    setQForm({ residenciaId: "", numero: "", tipo: "Solteiro", valorBase: "", ar: false, hidro: false });
    alert("Quarto cadastrado!");
    setTab("lista");
  };

  const valFinal = parseFloat(qForm.valorBase || "0") + (qForm.ar ? 30 : 0) + (qForm.hidro ? 50 : 0);

  return (
    <div>
      <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Residências e quartos</p>
      <TabBar
        tabs={[{ id: "lista", label: "Listar" }, { id: "nova", label: "Nova residência" }, { id: "quarto", label: "Novo quarto" }]}
        active={tab} onChange={setTab}
      />

      {tab === "lista" && residencias.map((r: Residencia) => (
        <Card key={r.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{r.nome}</div>
              <div style={{ fontSize: 12, color: C.gray600, marginTop: 2 }}>{r.endereco}, {r.numero} — {r.bairro} · CEP {r.cep}</div>
            </div>
            <Badge color="teal">{r.quartos.length} quartos</Badge>
          </div>
          <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: C.gray600 }}>Tel <strong style={{ color: "#333" }}>{r.telefone}</strong></span>
            <span style={{ fontSize: 12, color: C.gray600 }}>Email <strong style={{ color: "#333" }}>{r.email}</strong></span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {r.quartos.map((q: Quarto) => (
              <div key={q.id} style={{ border: "0.5px solid #e0e0d8", borderRadius: 8, padding: 12, background: "#fafaf8" }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Quarto {q.numero} · {q.tipo}</div>
                <div style={{ fontSize: 11, color: C.gray600, lineHeight: 1.8 }}>
                  Ar condicionado: {q.ar ? "sim" : "não"}<br />
                  Hidromassagem: {q.hidro ? "sim" : "não"}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.teal600, marginTop: 6 }}>
                  {fmtBRL(calcValorDiaria(q))}/diária
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {tab === "nova" && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Cadastrar residência</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Input label="Nome da residência" value={form.nome} onChange={v => setForm(p => ({ ...p, nome: v }))} placeholder="Ex: Pousada do Sol" />
            </div>
            <Input label="Endereço" value={form.endereco} onChange={v => setForm(p => ({ ...p, endereco: v }))} placeholder="Rua das Flores" />
            <Input label="Número" value={form.numero} onChange={v => setForm(p => ({ ...p, numero: v }))} placeholder="12" />
            <Input label="Bairro" value={form.bairro} onChange={v => setForm(p => ({ ...p, bairro: v }))} placeholder="Centro" />
            <Input label="CEP" value={form.cep} onChange={v => setForm(p => ({ ...p, cep: v }))} placeholder="45520-000" />
            <Input label="Telefone" value={form.telefone} onChange={v => setForm(p => ({ ...p, telefone: v }))} placeholder="(73) 98800-0000" />
            <Input label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="contato@email.com" />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn onClick={() => setForm({ endereco: "", numero: "", bairro: "", cep: "", telefone: "", email: "", nome: "" })}>Limpar</Btn>
            <Btn primary onClick={salvarResidencia}>Salvar</Btn>
          </div>
        </Card>
      )}

      {tab === "quarto" && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Cadastrar quarto</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Residência" value={qForm.residenciaId}
              onChange={v => setQForm(p => ({ ...p, residenciaId: v }))}
              options={[{ value: "", label: "Selecione..." }, ...residencias.map(r => ({ value: r.id.toString(), label: r.nome }))]}
            />
            <Input label="Número do quarto" value={qForm.numero} onChange={v => setQForm(p => ({ ...p, numero: v }))} placeholder="04" />
            <Input label="Tipo" value={qForm.tipo} onChange={v => setQForm(p => ({ ...p, tipo: v }))}
              options={[{ value: "Solteiro", label: "Solteiro" }, { value: "Casal", label: "Casal" }]}
            />
            <Input label="Valor base da diária (R$)" type="number" value={qForm.valorBase} onChange={v => setQForm(p => ({ ...p, valorBase: v }))} placeholder="150" />
            <Input label="Ar condicionado" value={qForm.ar ? "sim" : "nao"}
              onChange={v => setQForm(p => ({ ...p, ar: v === "sim" }))}
              options={[{ value: "nao", label: "Não" }, { value: "sim", label: "Sim (+R$30)" }]}
            />
            <Input label="Hidromassagem" value={qForm.hidro ? "sim" : "nao"}
              onChange={v => setQForm(p => ({ ...p, hidro: v === "sim" }))}
              options={[{ value: "nao", label: "Não" }, { value: "sim", label: "Sim (+R$50)" }]}
            />
            <div style={{ gridColumn: "1 / -1", background: C.teal50, borderRadius: 8, padding: 10, fontSize: 13, color: C.teal800 }}>
              Valor final da diária: <strong>{fmtBRL(valFinal)}</strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn onClick={() => setQForm({ residenciaId: "", numero: "", tipo: "Solteiro", valorBase: "", ar: false, hidro: false })}>Limpar</Btn>
            <Btn primary onClick={salvarQuarto}>Salvar</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── SEÇÃO: Clientes ───────────────────────────────────────────────────────────
function Clientes({ clientes, setClientes, alugueis }: { clientes: Cliente[]; setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>; alugueis: Aluguel[] }) {
  const [tab, setTab] = useState("lista");
  const [form, setForm] = useState({ nome: "", cpf: "", telefone: "", email: "", endereco: "" });

  const salvar = () => {
    if (!form.nome || !form.cpf) return alert("Preencha nome e CPF.");
    setClientes((prev: Cliente[]) => [...prev, { ...form, id: Date.now() }]);
    setForm({ nome: "", cpf: "", telefone: "", email: "", endereco: "" });
    alert("Cliente cadastrado!");
    setTab("lista");
  };

  return (
    <div>
      <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Clientes</p>
      <TabBar
        tabs={[{ id: "lista", label: "Listar" }, { id: "novo", label: "Novo cliente" }]}
        active={tab} onChange={setTab}
      />

      {tab === "lista" && (
        <Card>
          {clientes.map((c: Cliente, i: number) => {
            const qtd = alugueis.filter((a: Aluguel) => a.clienteId === c.id).length;
            return (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < clientes.length - 1 ? "0.5px solid #eee" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.nome}</div>
                  <div style={{ fontSize: 11, color: C.gray600, marginTop: 2 }}>
                    CPF {c.cpf} · {c.email} · {c.telefone}
                  </div>
                </div>
                <Badge color={qtd > 0 ? "teal" : "gray"}>{qtd} {qtd === 1 ? "aluguel" : "aluguéis"}</Badge>
              </div>
            );
          })}
        </Card>
      )}

      {tab === "novo" && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Cadastrar cliente</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Input label="Nome completo" value={form.nome} onChange={v => setForm(p => ({ ...p, nome: v }))} placeholder="Ana Souza" />
            </div>
            <Input label="CPF" value={form.cpf} onChange={v => setForm(p => ({ ...p, cpf: v }))} placeholder="000.000.000-00" />
            <Input label="Telefone" value={form.telefone} onChange={v => setForm(p => ({ ...p, telefone: v }))} placeholder="(73) 98700-0000" />
            <Input label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="email@email.com" />
            <div style={{ gridColumn: "1 / -1" }}>
              <Input label="Endereço" value={form.endereco} onChange={v => setForm(p => ({ ...p, endereco: v }))} placeholder="Rua, número, bairro, cidade" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn onClick={() => setForm({ nome: "", cpf: "", telefone: "", email: "", endereco: "" })}>Limpar</Btn>
            <Btn primary onClick={salvar}>Salvar</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── SEÇÃO: Reservas ───────────────────────────────────────────────────────────
function Reservas({ residencias, clientes, alugueis, setAlugueis }: { residencias: Residencia[]; clientes: Cliente[]; alugueis: Aluguel[]; setAlugueis: React.Dispatch<React.SetStateAction<Aluguel[]>> }) {
  const [tab, setTab] = useState("nova");
  const [form, setForm] = useState({
    clienteId: "", residenciaId: "", quartoId: "",
    entrada: "", saida: "",
  });

  const residenciaSelecionada = residencias.find((r: Residencia) => r.id === parseInt(form.residenciaId));
  const quartosDisponiveis = residenciaSelecionada?.quartos || [];
  const quartoSelecionado = quartosDisponiveis.find((q: Quarto) => q.id === parseInt(form.quartoId));

  const diarias = calcDiarias(form.entrada, form.saida);
  const valorDiaria = quartoSelecionado ? calcValorDiaria(quartoSelecionado) : 0;
  const total = diarias * valorDiaria;

  const confirmar = () => {
    if (!form.clienteId || !form.quartoId || !form.entrada || !form.saida)
      return alert("Preencha todos os campos.");
    if (diarias <= 0) return alert("Datas inválidas.");

    const conflito = alugueis.find((a: Aluguel) =>
      a.quartoId === parseInt(form.quartoId) &&
      (a.status === "Ativo" || a.status === "Reservado") &&
      new Date(form.entrada) < new Date(a.saida) &&
      new Date(form.saida) > new Date(a.entrada)
    );
    if (conflito) return alert("Quarto já ocupado nesse período!");

    const novo: Aluguel = {
      id: Date.now(),
      clienteId: parseInt(form.clienteId),
      residenciaId: parseInt(form.residenciaId),
      quartoId: parseInt(form.quartoId),
      entrada: form.entrada, saida: form.saida,
      diarias, valorFinal: total,
      status: new Date(form.entrada) > new Date() ? "Reservado" : "Ativo",
    };
    setAlugueis((prev: Aluguel[]) => [...prev, novo]);
    setForm({ clienteId: "", residenciaId: "", quartoId: "", entrada: "", saida: "" });
    alert("Reserva confirmada! Pagamento de " + fmtBRL(total) + " gerado.");
    setTab("historico");
  };

  return (
    <div>
      <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Reservas e aluguéis</p>
      <TabBar
        tabs={[{ id: "nova", label: "Nova reserva" }, { id: "historico", label: "Histórico" }]}
        active={tab} onChange={setTab}
      />

      {tab === "nova" && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Formulário de reserva</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Cliente" value={form.clienteId} onChange={v => setForm(p => ({ ...p, clienteId: v }))}
              options={[{ value: "", label: "Selecione..." }, ...clientes.map((c: Cliente) => ({ value: c.id.toString(), label: c.nome }))]}
            />
            <Input label="Residência" value={form.residenciaId}
              onChange={v => setForm(p => ({ ...p, residenciaId: v, quartoId: "" }))}
              options={[{ value: "", label: "Selecione..." }, ...residencias.map((r: Residencia) => ({ value: r.id.toString(), label: r.nome }))]}
            />
            <Input label="Quarto" value={form.quartoId} onChange={v => setForm(p => ({ ...p, quartoId: v }))}
              options={[
                { value: "", label: "Selecione a residência primeiro" },
                ...quartosDisponiveis.map((q: Quarto) => ({
                  value: q.id.toString(),
                  label: `Quarto ${q.numero} — ${q.tipo} (${fmtBRL(calcValorDiaria(q))}/diária)`
                }))
              ]}
            />
            <div />
            <Input label="Data e hora de entrada" type="datetime-local" value={form.entrada} onChange={v => setForm(p => ({ ...p, entrada: v }))} />
            <Input label="Data e hora de saída" type="datetime-local" value={form.saida} onChange={v => setForm(p => ({ ...p, saida: v }))} />
          </div>

          {diarias > 0 && quartoSelecionado && (
            <div style={{ marginTop: 14, padding: 14, background: C.teal50, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: C.teal800, lineHeight: 2 }}>
                {[
                  ["Diárias:", diarias],
                  ["Valor base/diária:", fmtBRL(quartoSelecionado.valorBase)],
                  ["Adicionais/diária:", fmtBRL(calcValorDiaria(quartoSelecionado) - quartoSelecionado.valorBase)],
                ].map((item) => {
                  const k = item[0] as string;
                  const v = item[1];
                  return (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{k}</span><strong>{v}</strong>
                    </div>
                  );
                })}
                <hr style={{ border: "none", borderTop: `1px dashed ${C.teal200}`, margin: "6px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span>Total a pagar:</span>
                  <strong style={{ color: C.teal600 }}>{fmtBRL(total)}</strong>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn onClick={() => setForm({ clienteId: "", residenciaId: "", quartoId: "", entrada: "", saida: "" })}>Limpar</Btn>
            <Btn primary onClick={confirmar}>Confirmar reserva</Btn>
          </div>
        </Card>
      )}

      {tab === "historico" && (
        <Card>
          {alugueis.length === 0 && (
            <p style={{ fontSize: 13, color: C.gray600, textAlign: "center", padding: 20 }}>Nenhum aluguel registrado.</p>
          )}
          {[...alugueis].reverse().map((a: Aluguel, i: number) => {
            const cli = clientes.find((c: Cliente) => c.id === a.clienteId);
            const res = residencias.find((r: Residencia) => r.id === a.residenciaId);
            const q = res?.quartos.find((q: Quarto) => q.id === a.quartoId);
            return (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < alugueis.length - 1 ? "0.5px solid #eee" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {cli?.nome} — Quarto {q?.numero}, {res?.nome}
                  </div>
                  <div style={{ fontSize: 11, color: C.gray600, marginTop: 2 }}>
                    Entrada: {fmtDT(a.entrada)} · Saída: {fmtDT(a.saida)} · {a.diarias} diárias
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge status={a.status} />
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.teal600, marginTop: 4 }}>{fmtBRL(a.valorFinal)}</div>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

// ─── SEÇÃO: Recibo ─────────────────────────────────────────────────────────────
function Recibo({ alugueis, clientes, residencias }: { alugueis: Aluguel[]; clientes: Cliente[]; residencias: Residencia[] }) {
  const [aluguelId, setAluguelId] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const aluguel = alugueis.find((a: Aluguel) => a.id === parseInt(aluguelId));
  const cli = clientes.find((c: Cliente) => c.id === aluguel?.clienteId);
  const res = residencias.find((r: Residencia) => r.id === aluguel?.residenciaId);
  const q = res?.quartos.find((q: Quarto) => q.id === aluguel?.quartoId);

  const gerar = () => {
    if (!aluguelId) return alert("Selecione um aluguel.");
    setMostrar(true);
  };

  const linhaRecibo = (label: string, valor: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
      <span>{label}</span><span>{valor}</span>
    </div>
  );

  return (
    <div>
      <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Emissão de recibo</p>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Input label="Selecionar aluguel" value={aluguelId} onChange={v => { setAluguelId(v); setMostrar(false); }}
            options={[
              { value: "", label: "Selecione..." },
              ...alugueis.map((a: Aluguel) => {
                const c = clientes.find((cl: Cliente) => cl.id === a.clienteId);
                const r = residencias.find((re: Residencia) => re.id === a.residenciaId);
                const qt = r?.quartos.find((q: Quarto) => q.id === a.quartoId);
                return { value: a.id.toString(), label: `${c?.nome} — Quarto ${qt?.numero}, ${r?.nome}` };
              })
            ]}
          />
        </div>
        <Btn primary onClick={gerar}>Gerar recibo</Btn>
      </Card>

      {mostrar && aluguel && (
        <Card>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Pousada Maraú</div>
            <div style={{ fontSize: 11, color: C.gray600 }}>Recibo de Hospedagem</div>
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: 13,
            border: "1px dashed #ccc", borderRadius: 8, padding: 20,
            background: "#fafaf8", lineHeight: 2,
          }}>
            {linhaRecibo("Cliente:", cli?.nome || "")}
            {linhaRecibo("CPF:", cli?.cpf || "")}
            {linhaRecibo("Residência:", res?.nome || "")}
            {linhaRecibo("Quarto:", `${q?.numero} — ${q?.tipo}` || "")}
            <hr style={{ border: "none", borderTop: "1px dashed #ccc", margin: "8px 0" }} />
            {linhaRecibo("Data/hora de entrada:", fmtDT(aluguel.entrada))}
            {linhaRecibo("Data/hora de saída:", fmtDT(aluguel.saida))}
            <hr style={{ border: "none", borderTop: "1px dashed #ccc", margin: "8px 0" }} />
            {linhaRecibo("Número de diárias:", aluguel.diarias.toString())}
            {linhaRecibo("Valor base/diária:", fmtBRL(q?.valorBase || 0))}
            {linhaRecibo("Adicionais/diária:", fmtBRL(calcValorDiaria(q!) - (q?.valorBase || 0)))}
            <hr style={{ border: "none", borderTop: "1px dashed #ccc", margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, fontSize: 15 }}>
              <span>Total a pagar:</span>
              <span style={{ color: C.teal600 }}>{fmtBRL(aluguel.valorFinal)}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "residencias", label: "Residências" },
  { id: "clientes", label: "Clientes" },
  { id: "reservas", label: "Reservas" },
  { id: "recibo", label: "Recibo" },
];

export default function App() {
  const [secao, setSecao] = useState("dashboard");
  const [residencias, setResidencias] = useState(RESIDENCIAS_INIT);
  const [clientes, setClientes] = useState(CLIENTES_INIT);








  const [alugueis, setAlugueis] = useState(ALUGUEIS_INIT);

  return (
    <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, minHeight: "100vh", background: "#f5f5f0" }}>
      {/* Header */}
      <div style={{ background: C.teal600, color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.02em" }}>Pousada Maraú</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>Sistema de Gerenciamento de Hospedagens</div>
        </div>
        <Badge color="green">Online</Badge>
      </div>

      {/* Nav */}
      <nav style={{ background: C.teal800, display: "flex", gap: 2, padding: "6px 20px 0", borderBottom: `2px solid ${C.teal400}` }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setSecao(item.id)}
            style={{
              padding: "7px 14px", fontSize: 12, fontWeight: 500, border: "none",
              background: secao === item.id ? "#fff" : "transparent",
              color: secao === item.id ? C.teal800 : "rgba(255,255,255,0.65)",
              cursor: "pointer", borderRadius: "6px 6px 0 0",
              transition: "all 0.15s", fontFamily: "inherit",
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Conteúdo */}
      <div style={{ padding: 20, maxWidth: 860, margin: "0 auto" }}>
        {secao === "dashboard" && (
          <Dashboard residencias={residencias} clientes={clientes} alugueis={alugueis} />
        )}
        {secao === "residencias" && (
          <Residencias residencias={residencias} setResidencias={setResidencias} />
        )}
        {secao === "clientes" && (
          <Clientes clientes={clientes} setClientes={setClientes} alugueis={alugueis} />
        )}
        {secao === "reservas" && (
          <Reservas
            residencias={residencias} clientes={clientes}
            alugueis={alugueis} setAlugueis={setAlugueis}
          />
        )}
        {secao === "recibo" && (
          <Recibo alugueis={alugueis} clientes={clientes} residencias={residencias} />
        )}
      </div>
    </div>
  );
}


