import fs from 'fs';
import path from 'path';

const pages = [
  'productos/ProductosPage.tsx',
  'categorias/CategoriasPage.tsx',
  'clientes/ClientesPage.tsx',
  'ordenes/OrdenesPage.tsx',
  'estadosOrdenes/EstadosOrdenes.tsx',
  'informacion/InformacionPage.tsx',
  'usuarios/ UsuariosPages.tsx',
];

pages.forEach((pagePath) => {
  const fullPath = path.join(process.cwd(), 'src/components/pages', pagePath);
  let content = fs.readFileSync(fullPath, 'utf8');

  // 1. Import useAlert
  if (!content.includes('useAlert')) {
    content = content.replace(
      "import { useAuth } from '../../../context/AuthContext';",
      "import { useAuth } from '../../../context/AuthContext';\nimport { useAlert } from '../../../context/AlertContext';",
    );
  }

  // 2. Destructure useAlert inside component
  if (!content.includes('const { showToast, showConfirm } = useAlert();')) {
    content = content.replace(
      'const { isAdmin } = useAuth();',
      'const { isAdmin } = useAuth();\n  const { showToast, showConfirm } = useAlert();',
    );
  }

  // 3. Replace handleEliminar
  const elRegex =
    /async function handleEliminar\(id: string\) {[\s\S]*?if \(!confirm\((.*?)\)\) return;[\s\S]*?try {[\s\S]*?await (\w+\.remove)\(id\);[\s\S]*?await cargar\(\);[\s\S]*?} catch \(e\) {[\s\S]*?setError\((.*?)\);[\s\S]*?}[\s\S]*?}/;

  const match = content.match(elRegex);
  if (match) {
    const confirmText = match[1];
    const repoRemove = match[2];
    const newEliminar = `function handleEliminar(id: string) {
    showConfirm({
      title: 'Confirmar eliminación',
      message: ${confirmText},
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await ${repoRemove}(id);
          await cargar();
          showToast('Registro eliminado exitosamente', 'success');
        } catch (e) {
          showToast(e instanceof Error ? e.message : 'Error al eliminar', 'error');
        }
      }
    });
  }`;
    content = content.replace(match[0], newEliminar);
  }

  // 4. Replace success toasts in handleSubmit
  const submitRegex = /await cargar\(\);\n    } catch \(e\) {/;
  if (content.match(submitRegex) && !content.includes("showToast('Guardado")) {
    content = content.replace(
      /await cargar\(\);\n    } catch \(e\) {/,
      "await cargar();\n      showToast('Guardado correctamente', 'success');\n    } catch (e) {",
    );
  }

  // 5. Replace setErrors with showToast
  content = content.replace(/setError\((.*?)\);/g, (_m: string, p1: string) => {
    if (p1 === 'null' || p1 === "''") return `setError(${p1});`; // keep resetting local error if they exist, or just remove
    return `showToast(${p1}, 'error');`;
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Processed Alerts: ${pagePath}`);
});
