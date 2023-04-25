CREATE TABLE `content` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `picture_id` int(11) NOT NULL,
  `picture_object` varchar(255) NOT NULL,
  `remark` text,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8
CREATE TABLE `files` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `object` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `state` varchar(255) NOT NULL,
  `remark` text,
  PRIMARY KEY (`fid`),
  UNIQUE KEY `object` (`object`)
) ENGINE=InnoDB AUTO_INCREMENT=264 DEFAULT CHARSET=utf8
CREATE TABLE `home` (
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `target_type` varchar(255) NOT NULL,
  `target_id` int(11) NOT NULL,
  `is_show` double DEFAULT '1',
  `remark` text,
  `sort` int(11) DEFAULT '0',
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`hid`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8
CREATE TABLE `publish` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_use` tinyint(1) NOT NULL,
  `remark` text NOT NULL,
  `content` text,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8
CREATE TABLE `target` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `source_type` varchar(255) NOT NULL,
  `source_id` int(11) NOT NULL,
  `target_type` varchar(255) NOT NULL,
  `target_id` int(11) NOT NULL,
  `sort` int(11) DEFAULT '0',
  `is_show` tinyint(1) DEFAULT '1',
  `video_autoplay` tinyint(1) DEFAULT NULL,
  `video_voice` tinyint(1) DEFAULT NULL,
  `video_loop` tinyint(1) DEFAULT NULL,
  `picture_zoom` tinyint(1) DEFAULT NULL,
  `remark` text,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8