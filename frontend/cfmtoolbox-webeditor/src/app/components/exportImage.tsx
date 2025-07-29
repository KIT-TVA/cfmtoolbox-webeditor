import { toPng, toSvg } from "html-to-image";

export async function exportFeatureModelImage({
  nodes,
  containerRef,
  constraints,
  format = "png",
  fileName = "feature-model",
}: {
  nodes: any[],
  containerRef: React.RefObject<HTMLElement>;
  constraints: {
    source: string;
    target: string;
    relation: string;
    card1Min: string;
    card1Max: string;
    card2Min: string;
    card2Max: string;
  }[];
  format?: "png" | "svg";
  fileName?: string;
}) {
  const container = containerRef.current;
  if (!container) {
    console.error("Container reference not found");
    return;
  }

  const constraintDiv = document.createElement("div");
  constraintDiv.style.marginTop = "2rem";
  constraintDiv.style.fontFamily = "monospace";
  constraintDiv.style.fontSize = "0.8rem";

  const listHtml = constraints
    .map((c) => {
      const sourceLabel = nodes.find((node) => node.id === c.source)?.data.label || c.source;
      const targetLabel = nodes.find((node) => node.id === c.target)?.data.label || c.target;
      const relationText = c.relation

      return `
      <li style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 0.5rem;
        border-radius: 0.25rem;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        font-family: sans-serif;
        font-size: 0.875rem;
      ">
        <span>
          ${sourceLabel} &lt;${c.card1Min}..${c.card1Max}&gt;
          <strong style="margin: 0 0.25rem;">${relationText}</strong>
          ${targetLabel} &lt;${c.card2Min}..${c.card2Max}&gt;
        </span>
      </li>
    `;
    })
    .join("");

  constraintDiv.innerHTML = `
  <h3 style="font-family: sans-serif; font-size: 1rem; margin-bottom: 0.5rem;">Constraints:</h3>
  <ul style="display: flex; flex-direction: column; gap: 0.5rem;">
    ${listHtml}
  </ul>
`;


  const originalTransform = container.style.transform;
  const originalTransformOrigin = container.style.transformOrigin; // Neu hinzugefügt
  const originalBackground = container.style.background;

  // Setze den Skalierungsfaktor temporär auf 1 und den Ursprung
  container.style.transform = "scale(1)";
  container.style.transformOrigin = "top left";
  container.style.background = "white";

  // ********** NEUER TEIL: Kanten-Stile temporär setzen **********
  // Finde alle sichtbaren Kantenpfade und setze deren Stile
  const edgePaths = container.querySelectorAll(".react-flow__edge-path");
  const originalEdgeStyles: { element: HTMLElement; style: string }[] = [];

  edgePaths.forEach((pathElement) => {
    const htmlPathElement = pathElement as HTMLElement; // Type assertion
    // Speichere den Original-Stil
    originalEdgeStyles.push({
      element: htmlPathElement,
      style: htmlPathElement.style.cssText,
    });

    // Setze die Export-Stile
    htmlPathElement.style.stroke = "black"; // Oder eine andere gewünschte Farbe
    htmlPathElement.style.strokeWidth = "2px"; // Oder eine andere gewünschte Dicke
    htmlPathElement.style.opacity = "1"; // Sicherstellen, dass es sichtbar ist
  });
  // ***************************************************************

  // Füge das Constraint-Div zum DOM hinzu
  container.appendChild(constraintDiv);

  try {
    const commonOptions = {
      cacheBust: true,
      skipFonts: true,
      backgroundColor: "#ffffff",
      width: container.scrollWidth,
      height: container.scrollHeight,
    };


    if (format === "png") {
      const dataUrl = await toPng(container, commonOptions);
      downloadImage(dataUrl, fileName + ".png");
    } else if (format === "svg") {
      const dataUrl = await toSvg(container, commonOptions);
      downloadImage(dataUrl, fileName + ".svg");
    }
  } catch (err) {
    console.error("Export failed", err);
  } finally {
    // Entferne das Constraint-Div wieder
    container.removeChild(constraintDiv);

    // Setze die Kanten-Stile auf ihre ursprünglichen Werte zurück
    originalEdgeStyles.forEach(({ element, style }) => {
      element.style.cssText = style; // Setzt den gesamten Stilstring zurück
    });

    // Setze den Transform- und Hintergrund-Stil zurück
    container.style.transform = originalTransform;
    container.style.transformOrigin = originalTransformOrigin;
    container.style.background = originalBackground;
  }
}

function downloadImage(dataUrl: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = dataUrl;
  link.click();
}
