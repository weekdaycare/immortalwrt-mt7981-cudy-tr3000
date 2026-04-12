include $(TOPDIR)/rules.mk

PKG_NAME:=luci-compat-keep
PKG_VERSION:=1.0
PKG_RELEASE:=1
PKG_MAINTAINER:=weekdaycare

include $(INCLUDE_DIR)/package.mk

define Package/luci-compat-keep
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Dependency Protector for OpenClash
  DEPENDS:=+luci-compat
endef

define Package/luci-compat-keep/description
  This is a meta-package to ensure that essential dependencies for OpenClash 
  (like luci-compat) are not removed during app updates.
endef

define Build/Compile
endef

define Package/luci-compat-keep/install
	$(INSTALL_DIR) $(1)/etc/openclash
	touch $(1)/etc/openclash/dep_protected
endef

$(eval $(call BuildPackage,luci-compat-keep))