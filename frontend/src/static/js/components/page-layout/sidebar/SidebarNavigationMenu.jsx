import React, { useContext } from 'react';
import urlParse from 'url-parse';
import { useUser } from '../../../utils/hooks/';
import { PageStore } from '../../../utils/stores/';
import { LinksContext, SidebarContext } from '../../../utils/contexts/';
import { NavigationMenuList } from '../../_shared';

export function SidebarNavigationMenu() {
  const { userCan, isAnonymous, pages: userPages } = useUser();

  const links = useContext(LinksContext);
  const sidebar = useContext(SidebarContext);

  const currentUrl = urlParse(window.location.href);
  const currentHostPath = (currentUrl.host + currentUrl.pathname).replace(/\/+$/, '');

  function formatItems(items) {
    return items.map((item) => {
      const url = urlParse(item.link);
      const active = currentHostPath === url.host + url.pathname;

      return {
        active,
        itemType: 'link',
        link: item.link || '#',
        icon: item.icon || null,
        iconPos: 'left',
        text: item.text || item.link || '#',
        itemAttr: {
          className: item.className || '',
        },
      };
    });
  }

  function MainMenuFirstSection() {
    const items = [];

    if (!sidebar.hideHomeLink) {
      items.push({
        link: links.home,
        icon: 'home',
        text: 'Home',
        className: 'nav-item-home',
      });
    }


    const extraItems = PageStore.get('config-contents').sidebar.mainMenuExtra.items;

    extraItems.forEach((navitem) => {
      items.push({
        link: navitem.link,
        icon: navitem.icon,
        text: navitem.text,
        className: navitem.className,
      });
    });

    return items.length ? <NavigationMenuList key="main-first" items={formatItems(items)} /> : null;
  }

  function MainMenuSecondSection() {
    const items = [];

    if (!isAnonymous) {
      if (userCan.addMedia) {
        items.push({
          link: links.user.addMedia,
          icon: 'video_call',
          text: 'Upload media',
          className: 'nav-item-upload-media',
        });

        if (userPages.media) {
          items.push({
            link: userPages.media,
            icon: 'video_library',
            text: 'My media',
            className: 'nav-item-my-media',
          });
        }
      }

      if (userCan.saveMedia) {
        items.push({
          link: userPages.playlists,
          icon: 'playlist_play',
          text: 'My playlists',
          className: 'nav-item-my-playlists',
        });
      }
    }

    return items.length ? <NavigationMenuList key="main-second" items={formatItems(items)} /> : null;
  }

  function UserMenuSection() {
    const items = [];

    if (PageStore.get('config-enabled').pages.history && PageStore.get('config-enabled').pages.history.enabled) {
      items.push({
        link: links.user.history,
        icon: 'history',
        text: PageStore.get('config-enabled').pages.history.title,
        className: 'nav-item-history',
      });
    }

    if (
      userCan.likeMedia &&
      PageStore.get('config-enabled').pages.liked &&
      PageStore.get('config-enabled').pages.liked.enabled
    ) {
      items.push({
        link: links.user.liked,
        icon: 'thumb_up',
        text: PageStore.get('config-enabled').pages.liked.title,
        className: 'nav-item-liked',
      });
    }

    return items.length ? <NavigationMenuList key="user" items={formatItems(items)} /> : null;
  }

  function CustomMenuSection() {
    const items = PageStore.get('config-contents').sidebar.navMenu.items;

    return items.length ? <NavigationMenuList key="custom" items={formatItems(items)} /> : null;
  }

  function AdminMenuSection() {
    const items = [];

    if (userCan.manageMedia) {
      items.push({
        link: links.manage.media,
        icon: 'miscellaneous_services',
        text: 'Manage media',
        className: 'nav-item-manage-media',
      });
    }

    if (userCan.manageUsers) {
      items.push({
        link: links.manage.users,
        icon: 'miscellaneous_services',
        text: 'Manage users',
        className: 'nav-item-manage-users',
      });
    }

    if (userCan.manageComments) {
      items.push({
        link: links.manage.comments,
        icon: 'miscellaneous_services',
        text: 'Manage comments',
        className: 'nav-item-manage-comments',
      });
    }

    return items.length ? <NavigationMenuList key="admin" items={formatItems(items)} /> : null;
  }

  return [MainMenuFirstSection(), MainMenuSecondSection(), UserMenuSection(), CustomMenuSection(), AdminMenuSection()];
}
