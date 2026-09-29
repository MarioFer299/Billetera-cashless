'use client';

export default function DetalleMovimiento({ detalle, moneyFormatter, dateFormatter }) {
  if (!detalle) return <dl id="detalle"></dl>;

  return (
    <dl id="detalle">
      {Object.entries(detalle).map(([key, val]) => {
        let formattedVal = val;
        if (/monto|saldo/.test(key)) {
          formattedVal = moneyFormatter(val);
        } else if (/created|updated/.test(key)) {
          formattedVal = dateFormatter(val);
        }

        return (
          <div key={key} style={{ display: 'contents' }}>
            <dt>{key}</dt>
            <dd>{formattedVal}</dd>
          </div>
        );
      })}
    </dl>
  );
}