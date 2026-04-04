#!/bin/bash
#
# https://github.com/P3TERX/Actions-OpenWrt
# File name: diy-part1.sh
# Description: OpenWrt DIY script part 1 (Before Update feeds)
#
# Copyright (c) 2019-2024 P3TERX <https://p3terx.com>
#
# This is free software, licensed under the MIT License.
# See /LICENSE for more information.
#

# Uncomment a feed source
#sed -i 's/^#\(.*helloworld\)/\1/' feeds.conf.default

# Add a feed source
#echo 'src-git helloworld https://github.com/fw876/helloworld' >>feeds.conf.default
#echo 'src-git passwall https://github.com/xiaorouji/openwrt-passwall' >>feeds.conf.default

# openwrt-tailscale 让 golang 工具链参与进来
git clone https://github.com/GuNanOvO/openwrt-tailscale.git --single-branch --filter=blob:none package/openwrt-tailscale
sed -i '/PKG_BUILD_DIR/a PKG_BUILD_DEPENDS:=golang\/host' package/openwrt-tailscale/package/tailscale/Makefile

git clone https://github.com/Tokisaki-Galaxy/luci-app-tailscale-community.git --single-branch --filter=blob:none package/luci-app-tailscale-community
git clone https://github.com/eamonxg/luci-theme-aurora --single-branch --filter=blob:none package/luci-theme-aurora
git clone https://github.com/eamonxg/luci-app-aurora-config --single-branch --filter=blob:none package/luci-app-aurora-config
git clone https://github.com/timsaya/luci-app-bandix --single-branch --filter=blob:none package/luci-app-bandix
git clone https://github.com/timsaya/openwrt-bandix --single-branch --filter=blob:none package/openwrt-bandix
git clone https://github.com/sirpdboy/netspeedtest.git --single-branch --filter=blob:none package/netspeedtest
