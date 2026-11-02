import { FormEvent, useState } from "react";
import { createLead, type FieldErrors, type Role } from "./api";

const STEPS: Record<Role, { title: string; text: string }[]> = {
  familia: [
    {
      title: "Nos cuentas tu casa",
      text: "Días, horario y edades de los niños.",
    },
    {
      title: "Ves hasta 3 personas",
      text: "Solo perfiles que encajan con lo que pediste.",
    },
    {
      title: "Ustedes deciden",
      text: "Se conocen en una videollamada corta.",
    },
  ],
  trabajo: [
    {
      title: "Nos cuentas tu experiencia",
      text: "También cuenta si has cuidado a tu propia familia.",
    },
    {
      title: "Revisamos tu perfil",
      text: "Una persona te llama. No hay contraseñas.",
    },
    {
      title: "Te presentamos",
      text: "Si una familia encaja, ustedes se conocen.",
    },
  ],
};

function digitsOf(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("503") && digits.length > 8) {
    return digits.slice(-8);
  }
  return digits;
}

export default function App() {
  const [path, setPath] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  function choose(next: Role) {
    setPath(next);
    setErrors((current) => ({ ...current, role: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (!path) nextErrors.role = "Elige una puerta.";
    if (name.trim().length < 3) nextErrors.name = "Escribe tu nombre.";
    if (digitsOf(phone).length !== 8) nextErrors.phone = "El celular lleva 8 números.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !path) {
      if (nextErrors.role) {
        document.querySelector<HTMLElement>("#llamar .choice")?.focus();
      } else if (nextErrors.name) {
        document.getElementById("nombre")?.focus();
      } else {
        document.getElementById("celular")?.focus();
      }
      return;
    }

    setSending(true);
    try {
      await createLead({ role: path, name, phone });
      setDone(true);
    } catch (error) {
      const fieldErrors = (error as { fieldErrors?: FieldErrors }).fieldErrors;
      setErrors(fieldErrors ?? { form: "No se pudo guardar. Inténtalo otra vez." });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <a className="skip" href="#puertas">
        Ir a las dos puertas
      </a>
      <header className="nav" id="inicio">
        <a className="brand" href="#inicio" aria-label="Nanny Ideal, inicio">
          <img src="/favicon.svg" alt="" width={36} height={36} />
          <span>Nanny Ideal</span>
        </a>
        <a className="nav-call" href="#llamar">
          Te llamamos
        </a>
      </header>

      <main>
        <section className="hero" id="puertas">
          <p className="kicker">San Salvador</p>
          <h1>
            Elige <em>una puerta.</em>
          </h1>
          <p className="hero-lead">
            Ayuda en casa, o un trabajo cuidando niños. Te guiamos paso a paso.
          </p>

          <div className="door-row">
            <a className="door door-home" href="#pasos" onClick={() => choose("familia")}>
              <span className="arch">
                <img src="/media/familia.webp" alt="" width={694} height={1024} />
              </span>
              <span className="door-body">
                <span className="door-index">01 · Para tu casa</span>
                <h2>Soy familia</h2>
                <p>Busco a alguien de confianza para cuidar en casa.</p>
              </span>
              <span className="door-action">Quiero empezar</span>
              <span className="door-note">Te llamamos. No llenas un formulario largo.</span>
            </a>

            <a className="door door-work" href="#pasos" onClick={() => choose("trabajo")}>
              <span className="arch">
                <img src="/media/nanny.webp" alt="" width={546} height={1024} />
              </span>
              <span className="door-body">
                <span className="door-index">02 · Para ti</span>
                <h2>Busco trabajo</h2>
                <p>Quiero trabajar cuidando niños.</p>
              </span>
              <span className="door-action">Quiero empezar</span>
              <span className="door-note">Empezar no tiene costo.</span>
            </a>
          </div>
          <p className="scroll-hint">La otra puerta está más abajo</p>
        </section>

        <section className="sheet" id="pasos">
          <div className="sheet-inner">
            <p className="kicker kicker-ink">Después de elegir</p>
            <h2>Tres pasos, nada más</h2>
            <p className="lead">
              Te guiamos en cada uno. Siempre puedes hablar con una persona.
            </p>
            <div className="switch" role="group" aria-label="Elige tu puerta">
              <ChoiceButton active={path === "familia"} onClick={() => choose("familia")}>
                Si buscas ayuda
              </ChoiceButton>
              <ChoiceButton active={path === "trabajo"} onClick={() => choose("trabajo")}>
                Si buscas trabajo
              </ChoiceButton>
            </div>
            {path ? (
              <ol className="steps" key={path}>
                {STEPS[path].map((step, index) => (
                  <li key={step.title}>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="waiting">Toca una puerta para ver tus pasos.</p>
            )}
          </div>
        </section>

        <section className="price">
          <div className="price-inner">
            <p className="kicker">Para la familia</p>
            <p className="price-line">
              <strong>$60</strong> para ver hasta 3 personas.
              <strong>$139</strong> solo si contratas.
            </p>
            <p className="price-note">Quien busca trabajo no paga por dejar su número.</p>
          </div>
        </section>

        <section className="call" id="llamar">
          <div className="call-card">
            {done ? (
              <div className="success" role="status">
                <p className="kicker kicker-ink">Listo</p>
                <h2>Te vamos a llamar</h2>
                <p>
                  Guardamos tu número. Lunes a viernes, de 9 de la mañana a 4 de
                  la tarde. Sábado, de 9 a 12.
                </p>
                <a className="text-link" href="#inicio">
                  Volver arriba
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <p className="kicker kicker-ink">Un solo paso</p>
                <h2>Déjanos tu nombre y tu celular</h2>
                <p className="lead">Te llamamos. No tienes que crear una cuenta.</p>

                <div className="switch" role="group" aria-label="¿Cuál es tu puerta?">
                  <ChoiceButton active={path === "familia"} onClick={() => choose("familia")}>
                    Soy familia
                  </ChoiceButton>
                  <ChoiceButton active={path === "trabajo"} onClick={() => choose("trabajo")}>
                    Busco trabajo
                  </ChoiceButton>
                </div>
                {errors.role ? <p className="field-error">{errors.role}</p> : null}

                <label htmlFor="nombre">Tu nombre</label>
                <input
                  id="nombre"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setErrors((current) => ({ ...current, name: undefined }));
                  }}
                  aria-invalid={errors.name ? true : undefined}
                />
                {errors.name ? <p className="field-error">{errors.name}</p> : null}

                <label htmlFor="celular">Tu celular</label>
                <input
                  id="celular"
                  name="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="8 números"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setErrors((current) => ({ ...current, phone: undefined }));
                  }}
                  aria-invalid={errors.phone ? true : undefined}
                />
                {errors.phone ? (
                  <p className="field-error">{errors.phone}</p>
                ) : (
                  <p className="hint">Son 8 números. Ejemplo: 7012 3456</p>
                )}

                {errors.form ? <p className="field-error">{errors.form}</p> : null}

                <button className="submit" type="submit" disabled={sending}>
                  {sending ? "Guardando…" : "Quiero que me llamen"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="footer-brand">Nanny Ideal</p>
        <p>Calle Arce, Plaza Las Américas, local 5, San Salvador.</p>
        <p>Frente a la Universidad Tecnológica.</p>
        <p>Lunes a viernes, de 9:00 a 4:00. Sábado, de 9:00 a 12:00.</p>
        <p className="footer-links">
          <a href="https://www.instagram.com/nannyideal.sv">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61588661046045">Facebook</a>
          <a href="https://www.tiktok.com/@nannyideal">TikTok</a>
        </p>
      </footer>
    </>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      className={active ? "choice choice-on" : "choice"}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
