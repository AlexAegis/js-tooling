export const isTargetEnvNotLocal = () => process.env['TARGET_ENV']?.toLowerCase() !== 'local';
