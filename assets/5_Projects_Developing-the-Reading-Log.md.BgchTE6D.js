import{_ as t,c as o,o as r,ag as a}from"./chunks/framework.BRQrZDXk.js";const p=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"5_Projects/Developing-the-Reading-Log.md","filePath":"5_Projects/Developing-the-Reading-Log.md"}'),i={name:"5_Projects/Developing-the-Reading-Log.md"};function n(l,e,s,c,h,d){return r(),o("div",null,e[0]||(e[0]=[a('<p>This is a tutorial on contributing to the &quot;My Books&quot; experience and developing the Reading Log.</p><p><a href="https://archive.org/embed/openlibrary-tour-2020/openlibrary-mybooks-primer.mp4" target="_blank" rel="noreferrer"><img src="https://github.com/internetarchive/openlibrary/assets/978325/1bd5c677-d4b8-4f53-b8b6-2b51291ac72e" alt="image"></a></p><p>For information on using the My Books Dropper, <a href="https://docs.google.com/document/d/1GTR00tr9lanAgwEA1N8J8iqnXDCGXac8GipQrnLEtBw/edit#heading=h.ef62m39avpmg" target="_blank" rel="noreferrer">go here</a>.</p><h2 id="the-patron-s-experience" tabindex="-1">The Patron&#39;s Experience <a class="header-anchor" href="#the-patron-s-experience" aria-label="Permalink to &quot;The Patron&#39;s Experience&quot;">​</a></h2><p>When a patron clicks on their <code>My Book</code> main navigation button, they&#39;re brought to the url <code>/account/books</code> and shown <code>My Books</code> overview that provides a summary of their loans, lists, reading log, and more:</p><p><img src="https://github.com/internetarchive/openlibrary/assets/978325/443c20ef-c8b0-4e61-986f-ade8ef7aaade" alt="image"></p><h2 id="templates" tabindex="-1">Templates <a class="header-anchor" href="#templates" aria-label="Permalink to &quot;Templates&quot;">​</a></h2><p>The html template that renders the <code>My Books</code> experiences is called <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html" target="_blank" rel="noreferrer">books.html</a>. This base template is used to render a variety of different my books pages consists of a left sidebar menu that looks like this:</p><p><img src="https://github.com/internetarchive/openlibrary/assets/978325/f30466ce-ddf2-42e7-8582-438875b96b46" alt="image"></p><p>The <code>books.html</code> template also contains rules for deciding what primary content and sub-templates will be rendered to the right-side of the menu, e.g.:</p><p><img src="https://github.com/internetarchive/openlibrary/assets/978325/3c2c28e8-5e8f-46ae-b7ee-3670a983271c" alt="image"></p><p>The main <code>books.html</code> base template is used to render the patron&#39;s...</p><ul><li>My Books Overview page (shown above)</li><li>Loans page <ul><li><img src="https://github.com/internetarchive/openlibrary/assets/978325/67c3f7aa-e2ae-4d43-a2f3-15213ac8fb0e" alt="image"></li></ul></li><li>Reading Log pages -- <a href="https://openlibrary.org/people/mekBot/books/want-to-read" target="_blank" rel="noreferrer">example</a><ul><li><img src="https://github.com/internetarchive/openlibrary/assets/978325/120609d8-4764-4981-919d-00dad838d4f7" alt="image"></li></ul></li><li>Lists overview page <ul><li><img src="https://github.com/internetarchive/openlibrary/assets/978325/88bb8024-226c-4792-a943-d3ed4bb4c98a" alt="image"></li></ul></li><li>Individual List pages <ul><li><img width="624" alt="Screenshot 2023-10-05 at 9 41 36 PM" src="https://github.com/internetarchive/openlibrary/assets/978325/bc0cc8ba-8839-4eb8-8678-689bf4efd869"></li></ul></li><li>Loan History page (in development but will look similar to the Reading Log pages</li></ul><h2 id="routing" tabindex="-1">Routing <a class="header-anchor" href="#routing" aria-label="Permalink to &quot;Routing&quot;">​</a></h2><p>As explained in the Patron&#39;s Experience section above, when a patron clicks on their My Books button, they will be brought to <code>/account/books</code> which will then redirect to <code>/people/{openlibrary_username}/books</code>. The routers that handles these redirects is defined in <a href="https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/account.py#L792-L811" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/account.py#L792-L811</a>. These redirects route to another set of routes defined in the mybooks.py plugin: <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L23-L44" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L23-L44</a>. These routers essentially look for any url pattern of the form <code>/people/{openlibrary_username}/{path}</code> and uses a controller in the same file, a class called <code>MyBooksTemplate</code> (defined on <a href="https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L184-L368" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L184-L368</a>) to render the appropriate my books view (such as overview, loans, loan history, reading log, lists, an individual list, etc).</p><p>Depending on the <code>{path}</code> specified within the url, different models may be used to prepare and fetch data and different sub-templates will ultimately be within the <code>books.html</code> base template. Within the <code>MyBooksTemplate</code>, a variable named <code>key</code> is used to make determinations based on the <code>{path}</code> about what data to fetch and what sub-templates to render .</p><h2 id="example-data-flow" tabindex="-1">Example Data Flow <a class="header-anchor" href="#example-data-flow" aria-label="Permalink to &quot;Example Data Flow&quot;">​</a></h2><ul><li>Patron types in the url <code>/account/books</code> after logging in, which is matched by the route in <code>plugins/account.py</code></li><li>Patron is redirected to <code>/people/{their_openlibrary_username}/books</code> which is matched by the <code>my_books_home</code> or <code>my_books_view</code> routes in <code>plugins/mybook.py</code> on <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L23" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L23</a></li><li>The router calls the <code>MyBooksTemplate</code> controller with a key of <code>mybooks</code> (instructing it to fetch the corresponding data for, and to render, the <code>mybooks</code> view): <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L184" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L184</a></li><li>In the preamble / initialization of the <code>MyBooksTemplate</code> controller, shared data will be fetched that is required by every view to generate the left sidebar menu (such as the logged in patron, the names of their lists, reading log counts): <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L202-L237" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L202-L237</a></li><li>Next, different <code>if</code> statements and control structures are hit to determine which data we should load and send to <code>templates/books.html</code> based on the <code>key</code> derived from the url pattern (e.g. <code>mybooks</code>, <code>lists</code>, <code>loan_history</code>, etc).</li><li>In this example, we determine based on the url we&#39;re on and the <code>key</code> value specified, that the LoggedBooksData model should be used to fetch the book data we need to render our view: <a href="https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L254-L270" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L254-L270</a></li><li>Eventually, when all the appropriate data is collected, it will be passed into the books.html base template: <a href="https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L288-L303" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L288-L303</a></li><li>In <code>books.html</code>, logic is defined that dynamically determines what the title of the web page should be (<a href="https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/templates/account/books.html#L27-L54" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/templates/account/books.html#L27-L54</a>), renders the left sidebar (<a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html#L74" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html#L74</a>) and then renders the correct child template for this view: <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html#L154-L173" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html#L154-L173</a></li></ul><h2 id="extending-the-my-books-system" tabindex="-1">Extending the My Books system <a class="header-anchor" href="#extending-the-my-books-system" aria-label="Permalink to &quot;Extending the My Books system&quot;">​</a></h2><ol><li>A new router defining your desired url pattern needs to be defined in <code>plugins/mybooks.html</code>, such as is done by <code>my_books_view</code>. This router should make a call to <code>MyBooksTemplate().render()</code></li><li><code>MyBooksTemplate</code> should be updated so there is an additional check within the <code>if</code> / <code>elif</code> control flow for the new <code>key</code> or page you wish to add. This section should fetch the books or data which will be required by the view.</li><li>You&#39;ll want to update <code>templates/book.html</code> (the base template for all of <code>My Books</code> views) so that it defines what the title should be and what templates should be rendered when your url pattern / <code>key</code> is encountered.</li><li>You may then have to create a new template within <code>templates/account/</code> that renders the data in a suitable way. In many cases, we&#39;ll want to refer to the <code>account/reading_log.html</code> template as the basis for our design: <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/reading_log.html" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/reading_log.html</a></li></ol><p>For a complete, minimal example of adding a new page or view to the My Books system, please refer to <a href="https://github.com/internetarchive/openlibrary/pull/8375" target="_blank" rel="noreferrer">PR #8375</a> as well as <a href="https://github.com/internetarchive/openlibrary/pull/8375#issuecomment-1749963570" target="_blank" rel="noreferrer">this comment</a> which describes how data specific to a new <code>loan_history</code> page may be prepared that is suitable to be passed through the <code>account/books.html</code> base template.</p><h2 id="extending-the-reading-log-an-outdated-example" tabindex="-1">Extending the Reading Log: An (outdated) example <a class="header-anchor" href="#extending-the-reading-log-an-outdated-example" aria-label="Permalink to &quot;Extending the Reading Log: An (outdated) example&quot;">​</a></h2><p>NOTE: This section is now outdated as much of the routing and controller logic has been moved out of <code>plugins/upstream/account.py</code> and in to <code>plugins/upstream/mybooks.py</code>, into the <code>MyBooksTemplate</code>. Still, this section is useful to see how we went about extending the functionality of the Reading Log page to add the ability to search for books on your currently reading, want to read, and already reading shelves.</p><p>In <a href="https://github.com/internetarchive/openlibrary/issues/5080" target="_blank" rel="noreferrer">#5080</a>, you can read through a slightly unrealistic example of adding Search filtering capabilities to the Reading Log:</p><p>By unrealistic, we mean that this proposal currently will not work as implemented because book titles, authors, and the other data we&#39;d like to search for are not kept in our ReadingLog db table, only the OL identifiers. We may be able to achieve this with solr in the future. But assuming we did have the desired info in our database (and as a thought exercise):</p><ol><li>First, we&#39;d need to update the Reading Log html template (<a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html</a>) to include a search box (design task). For a first version, we&#39;d probably use an html form which submits a GET search query , similar to what we have on the author&#39;s page: <a href="https://openlibrary.org/authors/OL7283091A" target="_blank" rel="noreferrer">https://openlibrary.org/authors/OL7283091A</a><img src="https://user-images.githubusercontent.com/978325/115574144-38ef9c80-a276-11eb-9ff9-5c53f78e45cb.png" alt="openlibrary org_authors_OL7229114A_Robert_Alan_Hill (1)">. In the future, we might want to use javascript (similar to how we the real-time Search box works at the top of the website): <img src="https://user-images.githubusercontent.com/978325/115574443-7a804780-a276-11eb-875f-5325f5b61ebc.png" alt="openlibrary org_authors_OL7229114A_Robert_Alan_Hill (2)"></li><li>Next, we&#39;d need to update the <code>public_my_books</code> controller method in <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L733-L760" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L733-L760</a> to accept a GET parameter. Already, the function expects a <code>page</code> variable to be sent as a GET parameters (<a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L738" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L738</a>) so accomplishing this should be as straightforward as adding another parameters like, <code>i = web.input(page=1, search=None)</code>.</li><li>When/where we fetch the patron&#39;s books here: <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L754" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L754</a>, we need to alter the logic to check whether a <code>i.search</code> query is present (e.g. <code>if i.search</code>). If the <code>i.search</code> value is present, we&#39;ll need change the line <code>readlog.get_works</code> call so this optional <code>search</code> parameter is passed along with our request for matching books.</li><li><code>readlog</code> is an instance of <code>plugins.upstream.account.ReadingLog</code> (class defined here: <a href="https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L645" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L645</a>). Its <code>get_works</code> method (<a href="https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L716" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L716</a>) will need to be updated to accept an optional <code>search</code> parameter (e.g. <code>(key, page=1, limit=RESULTS_PER_PAGE, search=None)</code>). This <code>ReadingLog.get_works</code> function essentially uses a <code>KEYS</code> dictionary (defined here: <a href="https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L654-L660" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L654-L660</a>) to lookup and then invoke the proper book-fetching function.</li><li>Each of the corresponding <code>ReadingLog</code> methods referenced by the <code>KEYS</code> dictionary (namely: <code>get_waitlisted_editions</code>, <code>get_loans</code>, <code>get_want_to_read</code>, <code>get_currently_reading</code>, <code>get_already_read</code>) must thus also be updated to take an optional <code>search</code> parameter. Each of these functions ultimately makes an API call to the same function within our <code>Bookshelves</code> API model: <code>Bookshelves.get_users_logged_books</code> (<a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py#L118-L149" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py#L118-L149</a>)</li><li>After a search box form has been added to the <code>template</code>, the <code>public_my_books</code> view/controller has been edited to expect a <code>search</code> parameter, this <code>search</code> parameter is forwarded to our <code>readlog.get_works</code> call, and the <code>readlog</code> object (i.e. the <code>ReadingLog</code> class) have all been updated to accept an optional <code>search</code> parameter, we&#39;ll then need to do the hard work of modifying the actual API <code>Bookshelves.get_users_logged_books</code> (the thing which calls the database) to consider the possibility of an optional search parameter when requesting data from the database: <a href="https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py#L118-L149" target="_blank" rel="noreferrer">https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py#L118-L149</a>).</li></ol><p><a href="https://github.com/internetarchive/openlibrary/issues/5080#issue-864008133" target="_blank" rel="noreferrer">The same example above</a> (which pretends to add Search filtering to the Reading Log) can be adapted to add an option to sort one&#39;s Reading Log entries by date added, such as is requested in <a href="https://github.com/internetarchive/openlibrary/issues/4267" target="_blank" rel="noreferrer">Issue #4267</a>.</p>',27)]))}const m=t(i,[["render",n]]);export{p as __pageData,m as default};
