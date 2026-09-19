import fs from 'fs';
import path from 'path';

const pages = [
  'categorias/CategoriasPage.tsx',
  'clientes/ClientesPage.tsx',
  'ordenes/OrdenesPage.tsx',
  'estadosOrdenes/EstadosOrdenes.tsx',
  'informacion/InformacionPage.tsx',
];

pages.forEach((pagePath) => {
  const fullPath = path.join(process.cwd(), 'src/components/pages', pagePath);
  let content = fs.readFileSync(fullPath, 'utf8');

  // 1. Import useAuth if not present
  if (!content.includes('useAuth')) {
    content = content.replace(
      '// Interfaces',
      "// Context\nimport { useAuth } from '../../../context/AuthContext';\n\n// Interfaces",
    );
  }

  // 2. Add isAdmin destructuring inside the component
  const exportFuncMatch = content.match(/export function \w+\(\) \{\n/);
  if (exportFuncMatch && !content.includes('const { isAdmin } = useAuth();')) {
    content = content.replace(
      exportFuncMatch[0],
      `${exportFuncMatch[0]}  const { isAdmin } = useAuth();\n`,
    );
  }

  // 3. Wrap form section
  // It usually looks like:
  // {/* Formulario */}
  // <section className="card">
  //   <h2 className="card__title">
  //   ...
  //   </form>
  // </section>

  if (content.includes('{/* Formulario */}')) {
    const formStart = content.indexOf('{/* Formulario */}');
    const formSectionStart = content.indexOf(
      '<section className="card">',
      formStart,
    );

    // Find the end of this section. It's followed by {/* Listado */} or another section
    const listadoStart = content.indexOf('{/* Listado */}', formSectionStart);

    if (formSectionStart !== -1 && listadoStart !== -1) {
      const sectionContent = content.substring(formStart, listadoStart);

      // If not already wrapped
      if (!sectionContent.includes('{isAdmin && (')) {
        let newSectionContent = sectionContent.replace(
          '<section className="card">',
          '{isAdmin && (\n        <section className="card">',
        );
        // Find the last </section> before {/* Listado */}
        const lastSectionEnd = newSectionContent.lastIndexOf('</section>');
        newSectionContent =
          newSectionContent.substring(0, lastSectionEnd + 10) +
          '\n      )}' +
          newSectionContent.substring(lastSectionEnd + 10);

        content =
          content.substring(0, formStart) +
          newSectionContent +
          content.substring(listadoStart);
      }
    }
  }

  // 4. Wrap action buttons in table
  // <td className="table__actions">
  //   <button ... onClick={() => handleEditar(p)}>Editar</button>
  //   <button ... onClick={() => handleEliminar(p.id)}>Eliminar</button>
  // </td>

  // Note: some have handleVer, or handleCancelar...
  const tableActionsMatches = [
    ...content.matchAll(/<td className="table__actions">([\s\S]*?)<\/td>/g),
  ];
  tableActionsMatches.forEach((match) => {
    const innerHtml = match[1];
    if (!innerHtml.includes('isAdmin &&')) {
      const newInner = `\n                        {isAdmin && (\n                          <>${innerHtml}</>\n                        )}\n                      `;
      content = content.replace(
        match[0],
        `<td className="table__actions">${newInner}</td>`,
      );
    }
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Processed: ${pagePath}`);
});
