import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-status-BIX7ZILg.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "d3a4c9d86645e56cf9474e434a5a59fc2cc797952f0fefd36898b21370eda9ed",
	name: "getAiStatus",
	filename: "src/lib/ai-status.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "POST" }).handler(getAiStatus_createServerFn_handler, async () => {
	return { grok: Boolean(process.env.XAI_API_KEY) };
});
//#endregion
export { getAiStatus_createServerFn_handler };
