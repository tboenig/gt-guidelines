<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:variable name="file_name" select="tokenize(base-uri(), '/')[last()]"/>
    
    
    <xsl:template match="/">
        
            <xsl:if test="$file_name = 'trLigaturen2.dita'">
                <xsl:result-document method="text" href="ligatur_rules.json">
                    hallo
                </xsl:result-document>
            </xsl:if>
        
        
    </xsl:template>
    
    
    
    
    
</xsl:stylesheet>