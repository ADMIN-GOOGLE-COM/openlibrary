import{_ as s,c as a,o as t,ag as e}from"./chunks/framework.BRQrZDXk.js";const c=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"2_Developers/3_Backend/General.md","filePath":"2_Developers/3_Backend/General.md"}'),n={name:"2_Developers/3_Backend/General.md"};function h(l,i,p,o,r,d){return t(),a("div",null,i[0]||(i[0]=[e(`<h2 id="code-organization" tabindex="-1">Code Organization <a class="header-anchor" href="#code-organization" aria-label="Permalink to &quot;Code Organization&quot;">​</a></h2><ul><li>openlibrary/core - core openlibrary functionality, imported and used by www</li><li>openlibrary/plugins - other models, controllers, and view helpers</li><li>openlibrary/views - views for rendering web pages</li><li>openlibrary/templates - all the templates used in the website</li><li>openlibrary/macros - macros are like templates, but can be called from wikitext</li></ul><h2 id="architecture" tabindex="-1">Architecture <a class="header-anchor" href="#architecture" aria-label="Permalink to &quot;Architecture&quot;">​</a></h2><h3 id="the-backend" tabindex="-1">The Backend <a class="header-anchor" href="#the-backend" aria-label="Permalink to &quot;The Backend&quot;">​</a></h3><p>OpenLibrary is developed on top of the Infogami wiki system, which is itself built on top of the web.py Python web framework and the Infobase database framework.</p><ul><li><a href="https://openlibrary.org/about/tech" target="_blank" rel="noreferrer">Overview of Backend Web Technologies</a></li></ul><p>Once you&#39;ve read the overview of OpenLibrary Backend technologies, it&#39;s highly encouraged you read the developer primer which explains how to use Infogami (and its database, Infobase).</p><ul><li><a href="https://openlibrary.org/dev/docs/infogami" target="_blank" rel="noreferrer">Infogami Developer Tutorial</a></li></ul><p>If you want to dive into the source code for Infogami, see the <a href="https://github.com/internetarchive/infogami" target="_blank" rel="noreferrer">Infogami repo</a>.</p><p><a name="backend-guide"></a></p><h2 id="backend-guide" tabindex="-1">Backend Guide <a class="header-anchor" href="#backend-guide" aria-label="Permalink to &quot;Backend Guide&quot;">​</a></h2><p><a name="memcache"></a></p><h3 id="memcache" tabindex="-1">Memcache <a class="header-anchor" href="#memcache" aria-label="Permalink to &quot;Memcache&quot;">​</a></h3><ul><li>Infobase queries get cached in memcache. In the dev instance, there is a single-node memcache instance that you can test by connecting to it:</li></ul><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">$</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> docker compose run </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rm home python</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Python </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3.10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.5 (main, Jun </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">23</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2022</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">17</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">14</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">57</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[Clang </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">13.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.6 (clang</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1316.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.21.2.5)] on darwin</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Type </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;help&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;copyright&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;credits&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> or</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;license&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> more information.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> yaml</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> openlibrary.utils </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> olmemcache</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> with</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> open</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/openlibrary/conf/openlibrary-docker.yml&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> in_file:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     y = yaml.safe_load(in_file)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">...</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mc = olmemcache.Client(y[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;memcache_servers&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">])</span></span></code></pre></div><p>to <strong>GET</strong> the memcached entry:</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mc.get(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/authors/OL18319A&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;{&quot;bio&quot;: {&quot;type&quot;: &quot;/type/text&quot;, &quot;value&quot;: &quot;Mark Twain, was an American author and humorist. Twain is noted for his novels Adventures of Huckleberry Finn (1884), which has been called </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;the Great American Novel</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;, and The Adventures of Tom Sawyer (1876). He is extensively quoted. Twain was a friend to presidents, artists, industrialists, and European royalty. ([Source][1].)</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">r</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">n</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">r</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">n[1]:http://en.wikipedia.org/wiki/Mark_Twain&quot;}, &quot;photograph&quot;: &quot;/static/files//697/OL2622189A_photograph_1212404607766697.jpg&quot;, &quot;name&quot;: &quot;Mark Twain&quot;, &quot;marc&quot;: [&quot;1 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">u001faTwain, Mark,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">u001fd1835-1910.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">u001e&quot;], &quot;alternate_names&quot;: [&quot;Mark TWAIN&quot;, &quot;M. Twain&quot;, &quot;TWAIN&quot;, &quot;Twain&quot;, &quot;Twain, Mark (pseud)&quot;, &quot;Twain, Mark (Spirit)&quot;, &quot;Twain, Mark, 1835-1910&quot;, &quot;Mark (Samuel L. Clemens) Twain&quot;, &quot;Samuel Langhorne Clemens (Mark Twain)&quot;, &quot;Samuel Langhorne Clemens&quot;, &quot;mark twain &quot;], &quot;death_date&quot;: &quot;21 April 1910&quot;, &quot;wikipedia&quot;: &quot;http://en.wikipedia.org/wiki/Mark_Twain&quot;, &quot;created&quot;: {&quot;type&quot;: &quot;/type/datetime&quot;, &quot;value&quot;: &quot;2013-03-28T07:50:47.897206&quot;}, &quot;last_modified&quot;: {&quot;type&quot;: &quot;/type/datetime&quot;, &quot;value&quot;: &quot;2013-03-28T07:50:47.897206&quot;}, &quot;latest_revision&quot;: 1, &quot;key&quot;: &quot;/authors/OL18319A&quot;, &quot;birth_date&quot;: &quot;30 November 1835&quot;, &quot;title&quot;: &quot;(pseud)&quot;, &quot;personal_name&quot;: &quot;Mark Twain&quot;, &quot;type&quot;: {&quot;key&quot;: &quot;/type/author&quot;}, &quot;revision&quot;: 1}&#39;</span></span></code></pre></div><p>to <strong>DELETE</strong> a memcached entry:</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mc.delete(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/authors/OL18319A&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><ul><li>You can also find memcached items using the Internet Archive ID (import <code>memcache</code> instead of <code>olmemecache</code>):</li></ul><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> yaml</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> memcache</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> with</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> open</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;openlibrary.yml&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> in_file:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     y </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> yaml.safe_load(in_file)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">...</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mc </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> memcache.Client(y[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;memcache_servers&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">])</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mc.get(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ia.get_metadata-&quot;houseofscorpion00farmrich&quot;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><a name="logs"></a></p><h3 id="logs" tabindex="-1">Logs <a class="header-anchor" href="#logs" aria-label="Permalink to &quot;Logs&quot;">​</a></h3><table tabindex="0"><thead><tr><th>**WARNING: This section is likely out of date and might need to be re-written.</th></tr></thead></table><ul><li><p>Logs for the upstart services will be in <code>/var/log/upstart/</code>.</p></li><li><p>The app server logs will be in <code>/var/log/upstart/ol-web.log</code>.</p></li></ul><p><a name="database"></a></p><h3 id="database" tabindex="-1">Database <a class="header-anchor" href="#database" aria-label="Permalink to &quot;Database&quot;">​</a></h3><ul><li><p>You should never work directly with the database, all the data are indeed managed by Open Library through <em>infobase</em>, but, if you are brave and curious, here you can find some useful info.</p></li><li><p>The first thing you have to know is that Open Library is based on a <a href="https://en.wikipedia.org/wiki/Triplestore" target="_blank" rel="noreferrer">triplestore</a> database running on <em>Postgres</em>.</p></li><li><p>To connect to the db run:</p></li></ul><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">su</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgres</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">psql</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> openlibrary</span></span></code></pre></div><ul><li>All the OL’s entities are stored as things in the <code>thing</code> table.</li></ul><p>Every raw contains:</p><table tabindex="0"><thead><tr><th>id</th><th>key</th><th>type</th><th>latest_revision</th><th>created</th><th>last_modified</th></tr></thead></table><ul><li>It is useful identify the <code>id</code> of some particular types: <code>/type/author</code> <code>/type/work</code> <code>/type/edition</code> <code>/type/user</code></li></ul><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">openlibrary</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> thing </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">WHERE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> key=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/type/author&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> OR</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> key=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/type/edition&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> OR</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> key=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/type/work&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> OR</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> key=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/type/user&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>this query returns something like:</p><table tabindex="0"><thead><tr><th>id</th><th>key</th><th>type</th><th>latest_revision</th><th>created</th><th>last_modified</th></tr></thead><tbody><tr><td>17872418</td><td>/type/work</td><td>1</td><td>14</td><td>2008-08-18 22:51:38.685066</td><td>2010-08-09 23:37:25.678493</td></tr><tr><td>22</td><td>/type/user</td><td>1</td><td>5</td><td>2008-03-19 16:44:20.354477</td><td>2009-03-16 06:21:53.030443</td></tr><tr><td>52</td><td>/type/edition</td><td>1</td><td>33</td><td>2008-03-19 16:44:24.216334</td><td>2009-09-22 10:44:06.178888</td></tr><tr><td>58</td><td>/type/author</td><td>1</td><td>11</td><td>2008-03-19 16:44:24.216334</td><td>2009-06-29 12:35:31.346997</td></tr></tbody></table><ul><li>to count the <strong>authors</strong>:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openlibrary=# SELECT count(*) as count FROM thing WHERE type=&#39;58&#39;;</span></span></code></pre></div><ul><li>to count the <strong>works</strong>:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openlibrary=# SELECT count(*) as count FROM thing WHERE type=&#39;17872418&#39;;</span></span></code></pre></div><ul><li>to count the <strong>editions</strong>:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openlibrary=# SELECT count(*) as count FROM thing WHERE type=&#39;52&#39;;</span></span></code></pre></div><ul><li>to count the <strong>users</strong>:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openlibrary=# SELECT count(*) as count FROM thing WHERE type=&#39;22&#39;;</span></span></code></pre></div><p><a name="recaptcha"></a></p><h2 id="database-migrations" tabindex="-1">Database Migrations <a class="header-anchor" href="#database-migrations" aria-label="Permalink to &quot;Database Migrations&quot;">​</a></h2><table tabindex="0"><thead><tr><th>**WARNING: This section is very out of date and needs to be re-written.</th></tr></thead></table><p>Occasionally, new tables get added to the Open Library database and some existing tables get altered. Scripts are provided to migrate the existing dev instances to the new schema.</p><p>To migrate an existing dev instance:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ python setup.py shell</span></span>
<span class="line"><span>$ python scripts/migrate_db.py</span></span></code></pre></div><p>This will look at the current database schema, identify its version, and upgrade it to the latest version.</p><p><a name="using-the-open-library-website"></a></p><h3 id="recaptcha" tabindex="-1">Recaptcha <a class="header-anchor" href="#recaptcha" aria-label="Permalink to &quot;Recaptcha&quot;">​</a></h3><table tabindex="0"><thead><tr><th>**WARNING: This section is likely out of date and might need to be re-written.</th></tr></thead></table><ul><li><p>Currently, we use reCAPTCHA v2, which validates users based on the &quot;I&#39;m not a robot&quot; checkbox.</p></li><li><p>To develop with reCAPTCHA v2 locally, for testing new user signups and edits that require a user to prove they are human, you will need to <a href="https://www.google.com/recaptcha/admin#list" target="_blank" rel="noreferrer">sign up for a reCAPTCHA API key pair</a> from Google Developers (Google account required): <code>https://developers.google.com/recaptcha/docs/display</code></p></li><li><p>On the <em>Manage your reCAPTCHA v2 API keys</em> page under <em>Register a new site</em> enter the following values:</p></li></ul><table tabindex="0"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody><tr><td><strong>Label</strong></td><td><em>Local OL dev</em></td></tr><tr><td><strong>Domains</strong></td><td><em>0.0.0.0</em></td></tr></tbody></table><ul><li><p>All reCAPTCHA v2 API keys work for local testing, so you do not need to enter the actual OpenLibrary domain. For example, <code>0.0.0.0</code> will work for the purpose of local development:</p></li><li><p>Once you have generated the keys, add them to your local <code>conf/openlibrary.yml</code> file by filling in the public and private keys under the <code>plugin_recaptcha</code> section.</p></li><li><p>From within the Docker container, restart the Open Library service via <code>sudo systemctl restart ol-web</code>. You can simply run <code>docker compose restart</code> as well for the same.</p></li></ul><h3 id="caching" tabindex="-1">Caching <a class="header-anchor" href="#caching" aria-label="Permalink to &quot;Caching&quot;">​</a></h3><p>The home page is cached by default. To clear the cache of any page in cache run the following command:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>docker compose restart memcached</span></span></code></pre></div>`,60)]))}const g=s(n,[["render",h]]);export{c as __pageData,g as default};
