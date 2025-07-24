import { toPng, toSvg } from "html-to-image";

export async function exportFeatureModelImage({
  containerRef,
  constraints,
  format = "png",
  fileName = "feature-model",
}: {
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

  constraintDiv.innerHTML = `
    <h3>Constraints:</h3>
    <ul>
      ${constraints
        .map(
          (c) =>
            `<li>${c.source} ${c.relation} ${c.target} (${c.card1Min}..${c.card1Max}) → (${c.card2Min}..${c.card2Max})</li>`
        )
        .join("")}
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
      // Es kann hilfreich sein, `width` und `height` basierend auf dem `scrollWidth`/`scrollHeight`
      // des Containers nach dem Hinzufügen der Constraints zu setzen, um den gesamten Inhalt zu erfassen.
      // width: container.scrollWidth,
      // height: container.scrollHeight,
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
