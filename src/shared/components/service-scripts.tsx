export function ServiceScripts() {
  const crispId = import.meta.env.VITE_CRISP_WEBSITE_ID
  const umamiId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  const umamiSrc = import.meta.env.VITE_UMAMI_SCRIPT_URL
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN
  const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID
  const openPanelId = import.meta.env.VITE_OPENPANEL_CLIENT_ID
  const ahrefsSrc = import.meta.env.VITE_AHREFS_SCRIPT_URL
  const dataFastSrc = import.meta.env.VITE_DATAFAST_SCRIPT_URL
  const selineSrc = import.meta.env.VITE_SELINE_SCRIPT_URL
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST
  const posthogKeyJson = JSON.stringify(posthogKey)
  const posthogHostJson = JSON.stringify(posthogHost)

  return (
    <>
      {umamiId && umamiSrc && (
        <script
          async
          src={umamiSrc}
          data-website-id={umamiId}
        />
      )}
      {plausibleDomain && (
        <script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      )}
      {openPanelId && (
        <script
          defer
          src="https://openpanel.dev/op1.js"
          data-client-id={openPanelId}
        />
      )}
      {ahrefsSrc && (
        <script
          async
          src={ahrefsSrc}
        />
      )}
      {dataFastSrc && (
        <script
          async
          src={dataFastSrc}
        />
      )}
      {selineSrc && (
        <script
          async
          src={selineSrc}
        />
      )}
      {posthogKey && posthogHost && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture identify alias people.set people.set_once set_config reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_distinct_id".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init(${posthogKeyJson},{api_host:${posthogHostJson},defaults:"2025-05-24"});`,
          }}
        />
      )}
      {clarityId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`,
          }}
        />
      )}
      {crispId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="${crispId}";(function(){var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.head.appendChild(s);})();`,
          }}
        />
      )}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var p=new URLSearchParams(location.search);var a=p.get("affonso")||p.get("ref");var k=p.get("promotekit_ref");if(a)localStorage.setItem("shipgo_affiliate",a);if(k)localStorage.setItem("shipgo_promotekit",k);})();`,
        }}
      />
    </>
  )
}
