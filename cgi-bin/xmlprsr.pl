#!/usr/bin/perl
# use strict;
# use warnings;
# Perl Script to parse XML file

my ($brd, $ft, $attr, $val, $mode) = @ARGV;

local $/;		# enable "slurp" mode

my $infile = "../${brd}/state_current.xml";
open (my $in_fh, "<", $infile) 
	or die "cannot open < $infile: $!";

our @context = ();	# context stack
local $/ = ">";			# setting input record seperator
our $row = 0;

#############################
## Pack Dat Stack
## (XML parsing)
#############################
while (1) {

		local $_ = <$in_fh>;
		$_ =~ s/^\s+|\s+$//g;		# trimming white space, yuck!
		
		last if $_ eq "";				# file has finally come to an end
		
		# to $text or to $tag, that is the real question
		my $text;
		my $tag;
		
		m{^(.*)<(.*?)>$}s;
		$text = $1;
		$tag = $2;
		
		# what is the meaning of $text?!
		if ($text ne "") {
				push @{$context[$row-1]}, $text;
		} elsif ($text eq "") {
				$row++;
		}
		
		# $tag, you're it!
		if ($tag =~ m{^(/?)(.+)}xs) {
				my $closing = ($1 ne "");		# is it (8) closingggg timeee (8)
				my $tagname = $2;						# tag name
				
				if ($closing) {
						push @{$context[$row-1]}, $tag;
						next; 	# woohoo, next iteration please!
				}
				
				# begin tag found!
				push @{$context[$row-1]}, $tagname;
				
		}
}


#############################
## Stack Attack 
## (saving the new value or 
## find state of the board)
#############################
# my $ch_found = 0;		# found the channel?
my $ft_found = 0;		# found the feature?

my $len = @context; # number of rows in @context
my @state = ();			# channel state of the board

if ( $mode eq "getstate" ) {
# find out which channel is enabled

		for my $i (0..$len-1) {
				my $col = $#{$context[$i]};		# number of columns
				
				if ($col == 0) { 
						# nothing to do here, only the tag name is here!
						next; 
				}
				
				if ($context[$i][1] eq "CHAN_ENA") {
						$state[0] = ($context[$i+1][1] eq "ON") ? 1 : 0;
				} elsif ($context[$i][1] eq "CHAN_ENB") {
						$state[1] = ($context[$i+1][1] eq "ON") ? 1 : 0;
				} elsif ($context[$i][1] eq "CHAN_ENC") {
						$state[2] = ($context[$i+1][1] eq "ON") ? 1 : 0;
				} elsif ($context[$i][1] eq "CHAN_END") {
						$state[3] = ($context[$i+1][1] eq "ON") ? 1 : 0;
						# we did what we were supposed to, now let's get outta heahh!
						last;
				}
		}
		print "$state[0],$state[1],$state[2],$state[3]\n";

} else {
		for my $i (0..$len-1) {
				my $col = $#{$context[$i]};		# number of columns
				
				if ($col == 0) { 
						# nothing to do here, only the tag name is here!
						next; 
				}
				
				if ($context[$i][0] eq "name") {
						$ft_found = ($context[$i][1] eq $ft);
						
				}
				
				if ( ($context[$i][0] eq $attr) && ($ft_found)) {
						if ( $mode ne "find" ) {
							# we found it! let's replace the value now :)
							$context[$i][1] = $val;
						} else {
							# return the value
							print "$context[$i][1]";
						}
						
						# we did what we were supposed to, now let's get outta heahh!
						last;
				}
				
		}
}

close ($in_fh)
	or warn "close failed: $!";

#############################
## Stack..put it back! 
## (printing to XML)
#############################
if ( ($mode ne "getstate") && ($mode ne "find") && ($ft_found eq "1") ) {

		my $outfile = "../${brd}/state_current.xml";
		# my $outfile = "../${brd}/outtaheah.xml";
		open (my $out_fh, ">", $outfile) 
			or die "cannot open > $outfile: $!";
			
		# print {$out_fh} "$brd, $ft, $attr, $val\n\n";

		my $tab = 0;
		for my $i (0..$len-1) {
				my $col = $#{$context[$i]};
				
				if ($col == 0) {
						# begin or end tag only
						
						local $_ = $context[$i][0];
			
						m{^(/?)(!?)(.+)}xs;
						my $closing = ($1 ne "");
						my $comment = $2;
						my $tagname = $3;
						
						# formatting section
						if ($closing) {
								if ($tab > 1) { 
										print {$out_fh} "\t";
								}
								
								if ($tab > 0) { 
										$tab--; 
								}
						} else {
								if ($comment) {
									$tab--;
								}
								$tab++;
						}
						
						for my $j (0..$tab-2) {
								print {$out_fh} "\t";
						}
						
						print {$out_fh} "<$context[$i][$j]>\n";
						
				} else {
						for my $j (0..$tab-1) {
								print {$out_fh} "\t";
						}
						print {$out_fh} "<$context[$i][0]>$context[$i][1]<$context[$i][2]>\n";
				}
		}

		# we're done, close the file!
		close ($out_fh)
			or warn "close failed: $!";
}

#############################
## Stack Playback! 
## (DEBUG: printing to console)
#############################
# for my $i (0..$len-1) {
# 	print "Row $i\t\tSize = $#{$context[$i]}\t\t$context[$i][0] $context[$i][1] $context[$i][2]\n";
# }