type Props = { id: string; title: string; lede?: string };

/** "#id" label, Anton title with the crimson period, and an optional lede. */
export default function SectionHead({ id, title, lede }: Props) {
  return (
    <header className="sec-head reveal">
      <p className="label"><b>#</b>{id}</p>
      <h2 className="sec-title">{title}<em>.</em></h2>
      {lede ? <p className="sec-lede">{lede}</p> : null}
    </header>
  );
}
