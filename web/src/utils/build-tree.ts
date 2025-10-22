export const buildTree = (files: { path: string }[]) => {
    const tree: Record<string, any> = {};
    if (!files) return tree;

    files.forEach(file => {
        const parts = file.path.split('/');
        let currentLevel = tree;
        parts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = {
                    name: part,
                    path: parts.slice(0, index + 1).join('/'),
                    isDirectory: index < parts.length - 1,
                    children: {},
                };
            }
            currentLevel = currentLevel[part].children;
        });
    });
    return tree;
};