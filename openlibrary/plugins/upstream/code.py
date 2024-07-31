"""Upstream customizations."""

import datetime
import hashlib
import json
import os.path
import random

import web

from infogami import config
from infogami.core import code as core
from infogami.plugins.api.code import jsonapi, make_query
from infogami.plugins.api.code import request as infogami_request

from infogami.infobase import client
from infogami.utils import delegate, app, types
from infogami.utils.view import public, safeint, render
from infogami.utils.view import render_template  # used for its side effects
from infogami.utils.context import context

from openlibrary import accounts

from openlibrary.plugins.upstream import addbook, addtag, covers, models, utils
from openlibrary.plugins.upstream import spamcheck
from openlibrary.plugins.upstream import merge_authors
from openlibrary.plugins.upstream import edits
from openlibrary.plugins.upstream import checkins
from openlibrary.plugins.upstream import borrow, recentchanges  # TODO: unused imports?
from openlibrary.plugins.upstream.utils import render_component
from openlibrary.utils import extract_numeric_id_from_olid

from openlibrary.core import bestbook as bestbook_model

if not config.get('coverstore_url'):
    config.coverstore_url = "https://covers.openlibrary.org"  # type: ignore[attr-defined]

import logging

logger = logging.getLogger('openlibrary.plugins.upstream.code')


class static(delegate.page):
    path = "/images/.*"

    def GET(self):
        host = 'https://%s' % web.ctx.host if 'openlibrary.org' in web.ctx.host else ''
        raise web.seeother(host + '/static' + web.ctx.path)


class history(delegate.mode):
    """Overwrite ?m=history to remove IP"""

    encoding = "json"

    @jsonapi
    def GET(self, path):
        query = make_query(web.input(), required_keys=['author', 'offset', 'limit'])
        query['key'] = path
        query['sort'] = '-created'
        # Possibly use infogami.plugins.upstream.utils get_changes to avoid json load/dump?
        history = json.loads(
            infogami_request('/versions', data={'query': json.dumps(query)})
        )
        for i, row in enumerate(history):
            history[i].pop("ip")
        return json.dumps(history)
class bestbook(delegate.page):
    path = r"/works/OL(\d+)W/awards"
    encoding = "json"

    def POST(self, work_id):
        """Give Award to a book"""

        user = accounts.get_current_user()
        i = web.input(edition_id=None, topic=None,
                      submitter=None, redir=False)
        key = i.edition_id if i.edition_id else ('/works/OL%sW' % work_id)
        edition_id = int(extract_numeric_id_from_olid(i.edition_id)) if i.edition_id else None

        if not user:
            raise web.seeother('/account/login?redirect=%s' % key)

        username = user.key.split('/')[2]

        def response(msg, status="success"):
            return delegate.RawText(json.dumps({
                status: msg
            }), content_type="application/json")

        if i.rating is None:
            models.Ratings.remove(username, work_id)
            r = response('removed rating')

        else:
            try:
                rating = int(i.rating)
                if rating not in models.Ratings.VALID_STAR_RATINGS:
                    raise ValueError
            except ValueError:
                return response('invalid rating', status="error")

            models.Ratings.add(
                username=username, work_id=work_id,
                rating=rating, edition_id=edition_id)
            r = response('rating added')

        if i.redir:
            raise web.seeother(key)
        return r

class bestbook_count(delegate.page):
    """API for award count"""
    path = "/awards/count"
    encoding = "json"

    @jsonapi
    def GET(self):
        filt = web.input(book_id=None, submitter=None, topic=None)
        result = bestbook_model.Bestbook.get_count(
            book_id=filt.book_id,
            submitter=filt.submitter,
            topic=filt.topic
            )
        return json.dumps({'count': result})

class edit(core.edit):
    """Overwrite ?m=edit behaviour for author, book, work, and people pages."""

    def GET(self, key):
        page = web.ctx.site.get(key)
        editable_keys_re = web.re_compile(
            r"/(authors|books|works|(people/[^/]+/)?lists)/OL.*"
        )
        if editable_keys_re.match(key):
            if page is None:
                return web.seeother(key)
            else:
                return addbook.safe_seeother(page.url(suffix="/edit"))
        else:
            return core.edit.GET(self, key)

    def POST(self, key):
        if web.re_compile('/(people/[^/]+)').match(key) and spamcheck.is_spam():
            return render_template(
                'message.html', 'Oops', 'Something went wrong. Please try again later.'
            )
        return core.edit.POST(self, key)


# handlers for change photo and change cover


class change_cover(delegate.mode):
    path = "/books/OL(\d)+M/cover"

    def GET(self, key):
        page = web.ctx.site.get(key)
        if page is None or page.type.key not in ['/type/edition', '/type/author']:
            raise web.seeother(key)
        return render.change_cover(page)


class change_photo(change_cover):
    path = r"(/authors/OL\d+A)/photo"


del delegate.modes[
    'change_cover'
]  # delete change_cover mode added by openlibrary plugin


class components_test(delegate.page):
    path = "/_dev/components/HelloWorld"

    def GET(self):
        return render_component('HelloWorld') + render_component('HelloWorld')


class library_explorer(delegate.page):
    path = "/explore"

    def GET(self):
        return render_template('library_explorer')


class merge_work(delegate.page):
    path = "/works/merge"

    def GET(self):
        i = web.input(records='', mrid=None, primary=None)
        user = web.ctx.site.get_user()
        has_access = user and (
            (user.is_admin() or user.is_librarian())
            or user.is_usergroup_member('/usergroup/super-librarians')
        )
        if not has_access:
            raise web.HTTPError('403 Forbidden')

        optional_kwargs = {}
        if not (
            user.is_usergroup_member('/usergroup/super-librarians') or user.is_admin()
        ):
            optional_kwargs['can_merge'] = 'false'

        return render_template(
            'merge/works', mrid=i.mrid, primary=i.primary, **optional_kwargs
        )


@web.memoize
@public
def vendor_js():
    pardir = os.path.pardir
    path = os.path.abspath(
        os.path.join(
            __file__,
            pardir,
            pardir,
            pardir,
            pardir,
            'static',
            'upstream',
            'js',
            'vendor.js',
        )
    )
    with open(path, 'rb') as in_file:
        digest = hashlib.md5(in_file.read()).hexdigest()
    return '/static/upstream/js/vendor.js?v=' + digest


@web.memoize
@public
def static_url(path):
    """Takes path relative to static/ and constructs url to that resource with hash."""
    pardir = os.path.pardir
    fullpath = os.path.abspath(
        os.path.join(__file__, pardir, pardir, pardir, pardir, "static", path)
    )
    with open(fullpath, 'rb') as in_file:
        digest = hashlib.md5(in_file.read()).hexdigest()
    return f"/static/{path}?v={digest}"


class DynamicDocument:
    """Dynamic document is created by concatenating various rawtext documents in the DB.
    Used to generate combined js/css using multiple js/css files in the system.
    """

    def __init__(self, root):
        self.root = web.rstrips(root, '/')
        self.docs = None
        self._text = None
        self.last_modified = None

    def update(self):
        keys = web.ctx.site.things({'type': '/type/rawtext', 'key~': self.root + '/*'})
        docs = sorted(web.ctx.site.get_many(keys), key=lambda doc: doc.key)
        if docs:
            self.last_modified = min(doc.last_modified for doc in docs)
            self._text = "\n\n".join(doc.get('body', '') for doc in docs)
        else:
            self.last_modified = datetime.datetime.utcnow()
            self._text = ""

    def get_text(self):
        """Returns text of the combined documents"""
        if self._text is None:
            self.update()
        return self._text

    def md5(self):
        """Returns md5 checksum of the combined documents"""
        return hashlib.md5(self.get_text().encode('utf-8')).hexdigest()


def create_dynamic_document(url, prefix):
    """Creates a handler for `url` for servering combined js/css for `prefix/*` pages"""
    doc = DynamicDocument(prefix)

    if url.endswith('.js'):
        content_type = "text/javascript"
    elif url.endswith(".css"):
        content_type = "text/css"
    else:
        content_type = "text/plain"

    class page(delegate.page):
        """Handler for serving the combined content."""

        path = "__registered_later_without_using_this__"

        def GET(self):
            i = web.input(v=None)
            v = doc.md5()
            if v != i.v:
                raise web.seeother(web.changequery(v=v))

            if web.modified(etag=v):
                oneyear = 365 * 24 * 3600
                web.header("Content-Type", content_type)
                web.header("Cache-Control", "Public, max-age=%d" % oneyear)
                web.lastmodified(doc.last_modified)
                web.expires(oneyear)
                return delegate.RawText(doc.get_text())

        def url(self):
            return url + "?v=" + doc.md5()

        def reload(self):
            doc.update()

    class hook(client.hook):
        """Hook to update the DynamicDocument when any of the source pages is updated."""

        def on_new_version(self, page):
            if page.key.startswith(doc.root):
                doc.update()

    # register the special page
    delegate.pages[url] = {}
    delegate.pages[url][None] = page
    return page


all_js = create_dynamic_document("/js/all.js", config.get("js_root", "/js"))
web.template.Template.globals['all_js'] = all_js()

all_css = create_dynamic_document("/css/all.css", config.get("css_root", "/css"))
web.template.Template.globals['all_css'] = all_css()


def reload():
    """Reload all.css and all.js"""
    all_css().reload()
    all_js().reload()


def user_can_revert_records():
    user = web.ctx.site.get_user()
    return user and (
        user.is_admin() or user.is_usergroup_member('/usergroup/super-librarians')
    )


@public
def get_document(key, limit_redirs=5):
    doc = None
    for i in range(limit_redirs):
        doc = web.ctx.site.get(key)
        if doc is None:
            return None
        if doc.type.key == "/type/redirect":
            key = doc.location
        else:
            return doc
    return doc


class revert(delegate.mode):
    def GET(self, key):
        raise web.seeother(web.changequery(m=None))

    def POST(self, key):
        i = web.input("v", _comment=None)
        v = i.v and safeint(i.v, None)

        if v is None:
            raise web.seeother(web.changequery({}))

        if not web.ctx.site.can_write(key) or not user_can_revert_records():
            return render.permission_denied(
                web.ctx.fullpath, "Permission denied to edit " + key + "."
            )

        thing = web.ctx.site.get(key, i.v)

        if not thing:
            raise web.notfound()

        def revert(thing):
            if thing.type.key == "/type/delete" and thing.revision > 1:
                prev = web.ctx.site.get(thing.key, thing.revision - 1)
                if prev.type.key in ["/type/delete", "/type/redirect"]:
                    return revert(prev)
                else:
                    prev._save("revert to revision %d" % prev.revision)
                    return prev
            elif thing.type.key == "/type/redirect":
                redirect = web.ctx.site.get(thing.location)
                if redirect and redirect.type.key not in [
                    "/type/delete",
                    "/type/redirect",
                ]:
                    return redirect
                else:
                    # bad redirect. Try the previous revision
                    prev = web.ctx.site.get(thing.key, thing.revision - 1)
                    return revert(prev)
            else:
                return thing

        def process(value):
            if isinstance(value, list):
                return [process(v) for v in value]
            elif isinstance(value, client.Thing):
                if value.key:
                    if value.type.key in ['/type/delete', '/type/revert']:
                        return revert(value)
                    else:
                        return value
                else:
                    for k in value:
                        value[k] = process(value[k])
                    return value
            else:
                return value

        for k in thing:
            thing[k] = process(thing[k])

        comment = i._comment or "reverted to revision %d" % v
        thing._save(comment)
        raise web.seeother(key)


def setup():
    """Setup for upstream plugin"""
    models.setup()
    utils.setup()
    addbook.setup()
    addtag.setup()
    covers.setup()
    merge_authors.setup()
    # merge_works.setup() # ILE code
    edits.setup()
    checkins.setup()

    from openlibrary.plugins.upstream import data, jsdef

    data.setup()

    # setup template globals
    from openlibrary.i18n import ugettext, ungettext, gettext_territory

    web.template.Template.globals.update(
        {
            "gettext": ugettext,
            "ugettext": ugettext,
            "_": ugettext,
            "ungettext": ungettext,
            "gettext_territory": gettext_territory,
            "random": random.Random(),
            "commify": web.commify,
            "group": web.group,
            "storage": web.storage,
            "all": all,
            "any": any,
            "locals": locals,
        }
    )

    web.template.STATEMENT_NODES["jsdef"] = jsdef.JSDefNode


setup()
