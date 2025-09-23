import { toPng, toSvg } from "html-to-image";

/**
 * Function to export the current feature model as an image (png or svg).
 * @param nodes Nodes of the feature model
 * @param containerRef Reference to the container element of the reactflow editor
 * @param constraints Constraints of the feature model
 * @param format "png" | "svg"
 * @param fileName Name of the exported file without extension
 * @returns exported image of the feature model with constraints as png or svg
 */
export async function exportFeatureModelImage({
  nodes,
  containerRef,
  constraints,
  format = "png",
  fileName = "feature-model",
}: {
  nodes: any[];
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
  const container = containerRef.current?.querySelector(
    ".react-flow__viewport"
  ) as HTMLElement;
  if (!container) {
    console.error("Container reference not found");
    return;
  }

  const constraintDiv = document.createElement("div");
  constraintDiv.style.marginTop = "2rem";
  constraintDiv.style.fontFamily = "monospace";
  constraintDiv.style.fontSize = "0.8rem";

  const constraintText = constraints
    .map((c) => {
      const sourceLabel =
        nodes.find((node) => node.id === c.source)?.data.label || c.source;
      const targetLabel =
        nodes.find((node) => node.id === c.target)?.data.label || c.target;
      const relationText = c.relation;

      return `${sourceLabel} <${c.card1Min}..${c.card1Max}> ${relationText} ${targetLabel} <${c.card2Min}..${c.card2Max}>`;
    })
    .join("<br>");

  constraintDiv.innerHTML = `
  <div style="
    font-family: sans-serif;
    font-size: 0.9rem;
    text-align: center;
    padding: 1rem;
    background: transparent;
    margin-top: 2rem;
  ">
    <h3 style="margin-bottom: 1rem;">Constraints:</h3>
    ${constraintText}
  </div>
`;

  const originalTransform = container.style.transform;
  const originalTransformOrigin = container.style.transformOrigin;
  const originalBackground = container.style.background;

  // Set the scaling factor temporarily to 1 and the origin
  container.style.transform = "scale(1)";
  container.style.transformOrigin = "top left";
  container.style.background = "white";

  // ***************************************************************
  // Temporary set new edge styles
  // Find all visible edge paths and set their styles
  const edgePaths = container.querySelectorAll(".react-flow__edge-path");
  const originalEdgeStyles: { element: HTMLElement; style: string }[] = [];

  edgePaths.forEach((pathElement) => {
    const htmlPathElement = pathElement as HTMLElement; // Type assertion
    // Save original styles
    originalEdgeStyles.push({
      element: htmlPathElement,
      style: htmlPathElement.style.cssText,
    });

    // Set new styles
    htmlPathElement.style.stroke = "black";
    htmlPathElement.style.strokeWidth = "0.5px";
    htmlPathElement.style.opacity = "1";
  });
  // ***************************************************************

  // Appends the constraints to the DOM for export
  container.appendChild(constraintDiv);

  try {
    const bbox = getBoundingBox(nodes);

    const commonOptions = {
      cacheBust: true,
      skipFonts: true,
      backgroundColor: "transparent",
      width: bbox.width + 1000, // small Padding
      height: bbox.height + 1000,
      style: {
        transform: `translate(${-bbox.x + 25}px, ${-bbox.y + 25}px)`, // translate to top-left with padding
      },
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

    // Set the temporary styles for the edges back to original
    originalEdgeStyles.forEach(({ element, style }) => {
      element.style.cssText = style; // Set the original style
    });

    // Set the scaling factor and background style back to original
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

function getBoundingBox(nodes: any[]) {
  const xs = nodes.map((n) => n.position.x);
  const ys = nodes.map((n) => n.position.y);
  const widths = nodes.map((n) => n.position.x + (n.width ?? 0));
  const heights = nodes.map((n) => n.position.y + (n.height ?? 0));

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...widths);
  const maxY = Math.max(...heights);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
