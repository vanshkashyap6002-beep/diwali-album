import { useId } from "react";
export const rangoliMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><g transform="translate(200 200)"><circle r="168" fill="none" stroke="#f2d5a0" stroke-width="3"/><circle r="151" fill="none" stroke="#c77a30" stroke-width="9" stroke-dasharray="3 7"/>${Array.from({ length: 16 }, (_, i) => `<g transform="rotate(${i * 22.5})"><path d="M0-140Q-45-97 0-60Q45-97 0-140" fill="${i % 2 ? "#a84735" : "#e6a237"}" stroke="#f7e8c6" stroke-width="2"/><path d="M0-125Q-20-96 0-76Q20-96 0-125" fill="none" stroke="#f2d2a3" stroke-width="2"/><circle cy="-161" r="3" fill="#f7e8c6"/></g>`).join("")}<circle r="61" fill="#f3d8a8"/><circle r="53" fill="#a84735"/>${Array.from({ length: 8 }, (_, i) => `<ellipse cx="0" cy="-25" rx="10" ry="24" fill="#e6a237" transform="rotate(${i * 45})"/>`).join("")}<circle r="13" fill="#f7e8c6"/></g></svg>`;
export function Rangoli({ className = "" }: { className?: string }) {
  return (
    <span
      className={`rangoli ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: rangoliMarkup }}
    />
  );
}
export function Diya({
  lit = true,
  className = "",
}: {
  lit?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      className={`diya ${lit ? "is-lit" : ""} ${className}`}
      viewBox="0 0 240 200"
      role="img"
      aria-label={
        lit ? "A glowing terracotta diya" : "An unlit terracotta diya"
      }
    >
      <defs>
        <radialGradient id={`${id}glow`}>
          <stop stopColor="#ffcc6d" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffc36c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}clay`} x2="0" y2="1">
          <stop stopColor="#c27d51" />
          <stop offset=".5" stopColor="#9f5439" />
          <stop offset="1" stopColor="#66382c" />
        </linearGradient>
      </defs>
      {lit && (
        <ellipse
          className="diya-glow"
          cx="122"
          cy="104"
          rx="110"
          ry="95"
          fill={`url(#${id}glow)`}
        />
      )}
      <ellipse cx="121" cy="177" rx="77" ry="10" fill="#251710" opacity=".2" />
      <path
        d="M36 126Q119 92 206 126Q188 174 125 176Q66 173 36 126"
        fill={`url(#${id}clay)`}
        stroke="#613b2a"
        strokeWidth="2"
      />
      <ellipse cx="121" cy="125" rx="83" ry="23" fill="#ba774c" />
      <ellipse cx="121" cy="124" rx="72" ry="17" fill="#4f3126" />
      <ellipse cx="120" cy="123" rx="61" ry="11" fill="#a57231" opacity=".65" />
      <path
        d="M119 126q8-17 15-29"
        stroke="#ded0a1"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M52 139q70 40 139-2M64 153q58 25 113-2"
        fill="none"
        stroke="#d28e5f"
        strokeWidth="1.5"
        opacity=".65"
      />
      {lit && (
        <g className="flame">
          <path
            d="M133 37c6 23 20 38 16 54-5 21-33 21-35 1-2-19 16-28 19-55"
            fill="#ef9d30"
          />
          <path
            d="M133 56c2 14 12 25 10 36-3 13-19 13-22 1-2-12 10-20 12-37"
            fill="#ffdf82"
          />
          <path d="M132 78q12 19 1 25-14-4-1-25" fill="#fff4d5" />
        </g>
      )}
    </svg>
  );
}
export function Toran() {
  return (
    <div className="toran" aria-hidden="true">
      {Array.from({ length: 21 }, (_, i) => (
        <span
          key={i}
          style={
            {
              "--drop": `${Math.sin((i / 20) * Math.PI) * 22}px`,
            } as React.CSSProperties
          }
        >
          <b>✿</b>
          <i />
        </span>
      ))}
    </div>
  );
}
export function Altar() {
  return (
    <div className="altar">
      <div className="altar-frame">
        <img
          src="/art/lakshmi-ganesh.webp"
          alt="Traditional devotional painting of Goddess Lakshmi seated on a lotus and Lord Ganesha, with marigold offerings"
          width="1000"
          height="667"
        />
      </div>
      <div className="altar-cloth" />
      <div className="altar-lamps">
        <Diya />
        <span className="thali" aria-label="Brass puja thali with offerings">
          ✿
        </span>
        <Diya />
      </div>
    </div>
  );
}
export function HomeScene({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`home-art ${compact ? "compact" : ""}`}
      role="img"
      aria-label="An Indian home decorated for Diwali, with a marigold toran, Lakshmi–Ganesh altar, rangoli and glowing diyas"
    >
      <div className="sky-stars" />
      <div className="distant-house">
        <i />
        <i />
        <i />
      </div>
      <div className="home-wall">
        <div className="home-roof" />
        <div className="doorway">
          <div className="door-interior">
            <Altar />
          </div>
          <div className="door-panel left" />
          <div className="door-panel right" />
          <Toran />
        </div>
        <div className="home-window left" />
        <div className="home-window right" />
      </div>
      <div className="doorstep" />
      <div className="courtyard">
        <Rangoli />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Diya key={i} className={`floor-diya lamp-${i}`} />
        ))}
      </div>
      <div className="sky-burst" />
    </div>
  );
}
