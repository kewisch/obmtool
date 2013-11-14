SRCDIR=$(CURDIR)/src
OUTDIR=$(CURDIR)/output

all: package

help:
	@echo --- All help is in the Makefile ----
	@egrep '^#|^[a-z-]+:' Makefile

# Package all files to the xpi package
package:
	(cd $(SRCDIR); zip -9r $(OUTDIR)/obmdeveloper.xpi *)

# Clean up all package files
clean:
	$(RM) -r $(OUTDIR)/*

.PHONY : clean package all
